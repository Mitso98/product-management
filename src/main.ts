import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { ConfigurationStructure } from './config/ConfigurationStructure.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService =
    app.get<ConfigService<ConfigurationStructure>>(ConfigService);

  const port = configService.get<ConfigurationStructure['PORT']>('PORT');
  const globalPrefix =
    configService.get<ConfigurationStructure['GLOBAL_PREFIX']>('GLOBAL_PREFIX');

  app.setGlobalPrefix(globalPrefix);
  
  await app.listen(port);
}
bootstrap();
