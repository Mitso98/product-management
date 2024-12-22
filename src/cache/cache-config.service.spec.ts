import { Test, TestingModule } from '@nestjs/testing';
import { CacheConfigService } from './cache-config.service';
import { ConfigService } from '@nestjs/config';

describe('CacheConfigService', () => {
  let service: CacheConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheConfigService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              switch (key) {
                case 'redis.REDIS_HOST':
                  return 'localhost';
                case 'redis.REDIS_PORT':
                  return 6379;
                case 'redis.CACHE_TTL':
                  return 60;
                case 'redis.CACHE_MAX_ITEMS':
                  return 100;
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<CacheConfigService>(CacheConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return cache options', () => {
    const options = service.createCacheOptions();
    expect(options).toBeDefined();
    expect(options).toHaveProperty('store');
    expect(options).toHaveProperty('url');
    expect(options).toHaveProperty('ttl');
    expect(options).toHaveProperty('max');
  });
});
