import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import {
  AppConfigInterface,
  ConfigurationInterface,
} from './config/environmentVariables/configurationInterface.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService =
    app.get<ConfigService<ConfigurationInterface>>(ConfigService);

  const appVars = configService.get<AppConfigInterface>('app');

  app.setGlobalPrefix(appVars.GLOBAL_PREFIX);

  await app.listen(appVars.PORT);
}
bootstrap();
