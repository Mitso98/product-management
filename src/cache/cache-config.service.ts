import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  private readonly logger = new Logger(CacheConfigService.name);

  constructor(private configService: ConfigService) {}

  createCacheOptions(): CacheModuleOptions<RedisClientOptions> {
    const redisHost = this.configService.get('redis.REDIS_HOST', 'localhost');
    const redisPort = this.configService.get('redis.REDIS_PORT', 6379);

    const redisUrl = `redis://${redisHost}:${redisPort}`;

    this.logger.log(`Configuring Redis cache with URL: ${redisUrl}`);

    return {
      store: redisStore,
      url: redisUrl,
      ttl: this.configService.get('redis.CACHE_TTL', 60),
      max: this.configService.get('redis.CACHE_MAX_ITEMS', 100),
      isGlobal: true,
    };
  }
}
