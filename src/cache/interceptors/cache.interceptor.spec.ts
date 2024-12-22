import { CacheInterceptor } from './cache.interceptor';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from 'src/logger/logger.service';
import { of } from 'rxjs';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { Cache } from 'cache-manager';

describe('CacheInterceptor', () => {
  let interceptor: CacheInterceptor;
  let cacheManager: Cache;
  let logger: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheInterceptor,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            debug: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    interceptor = module.get<CacheInterceptor>(CacheInterceptor);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
    logger = module.get<LoggerService>(LoggerService);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should generate cache key', () => {
    const request = { url: '/test' };
    const key = interceptor['generateCacheKey'](request);
    expect(key).toBeDefined();
  });

  it('should invalidate cache', async () => {
    const path = '/test';
    await interceptor['invalidateCache'](path);
    expect(cacheManager.set).toHaveBeenCalled();
  });

  it('should check Redis connection', async () => {
    await interceptor['checkRedisConnection']();
    expect(logger.debug).toHaveBeenCalledWith('Redis connection successful');
  });

  it('should extract resource name', () => {
    const path = '/api/v1/test';
    const resourceName = interceptor['extractResourceName'](path);
    expect(resourceName).toBe('test');
  });

  it('should intercept and handle cache', async () => {
    const context: ExecutionContext = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({ url: '/test' }),
      getType: jest.fn().mockReturnValue('http'),
    } as any;
    const next: CallHandler = {
      handle: jest.fn().mockReturnValue(of('test')),
    };

    jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
    const result$ = await interceptor.intercept(context, next);

    result$.subscribe((result) => {
      expect(result).toBe('test');
    });
  });
});
