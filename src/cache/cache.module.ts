import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheConfigService } from './cache-config.service';
import { CacheInterceptor } from './interceptors/cache.interceptor';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.registerAsync({
      inject: [ConfigService],
      useClass: CacheConfigService,
      isGlobal: true,
    }),
  ],
  providers: [CacheInterceptor],
  exports: [CacheInterceptor],
})
export class RedisCacheModule {}
