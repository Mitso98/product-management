import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { CONFIG_KEYS } from './config/environmentVariables/configuration.constants';
import {
  AppConfigInterface,
  ConfigurationInterface,
} from './config/environmentVariables/ConfigurationInterface.interface';
import { config } from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService =
    app.get<ConfigService<ConfigurationInterface>>(ConfigService);

  const appVars = configService.get<AppConfigInterface>('app');

  app.setGlobalPrefix(appVars.GLOBAL_PREFIX);

  await app.listen(appVars.PORT);
}
bootstrap();
