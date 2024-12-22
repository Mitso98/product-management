import {
  Injectable,
  ExecutionContext,
  CallHandler,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private logger: LoggerService,
  ) {
    this.checkRedisConnection();
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const cacheKey = this.generateCacheKey(request);

    // Handle cache invalidation for PUT and DELETE requests
    if (
      request.method === 'PUT' ||
      request.method === 'DELETE' ||
      request.method === 'POST' ||
      request.method === 'PATCH'
    ) {
      await this.invalidateCache(request.path);
      return next.handle();
    }

    // Only cache GET requests
    if (request.method !== 'GET') {
      return next.handle();
    }

    try {
      const cachedResponse = await this.cacheManager.get(cacheKey);
      if (cachedResponse) {
        this.logger.debug(`Cache hit for key: ${cacheKey}`);
        return of(cachedResponse);
      }

      return next.handle().pipe(
        tap(async (response) => {
          await this.cacheManager.set(cacheKey, response);
          this.logger.debug(`Cache set for key: ${cacheKey}`);
        }),
      );
    } catch (error) {
      this.logger.error('Cache error:', error);
      return next.handle();
    }
  }

  private generateCacheKey(request: any): string {
    const { url, query } = request;
    return `${url}?${JSON.stringify(query)}`;
  }

  private async invalidateCache(path: string): Promise<void> {
    try {
      const keys = await this.cacheManager.store.keys();

      const resourceName = this.extractResourceName(path);

      const matchingKeys = keys.filter((key: string) =>
        key.includes(resourceName),
      );
      for (const key of matchingKeys) {
        await this.cacheManager.del(key);
        this.logger.debug(`Cache invalidated for key: ${key}`);
      }
    } catch (error) {
      this.logger.error('Cache invalidation error:', error);
    }
  }

  private async checkRedisConnection() {
    try {
      await this.cacheManager.set('test', 'test');
      await this.cacheManager.get('test');
      this.logger.debug('Redis connection successful');
    } catch (error) {
      this.logger.error('Redis connection error:', error);
    }
  }

  private extractResourceName(path: string): string {
    const match = path.match(/\/api\/v\d+\/(\w+)/);
    return match?.[1] || '';
  }
}
