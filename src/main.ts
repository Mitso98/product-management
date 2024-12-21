import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { CONFIG_KEYS } from './config/environmentVariables/configuration.constants';
import { ConfigurationStructure } from './config/environmentVariables/configurationStructure.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService =
    app.get<ConfigService<ConfigurationStructure>>(ConfigService);

  const port = configService.get<ConfigurationStructure['PORT']>(
    CONFIG_KEYS.PORT,
  );
  const globalPrefix = configService.get<
    ConfigurationStructure['GLOBAL_PREFIX']
  >(CONFIG_KEYS.GLOBAL_PREFIX);

  app.setGlobalPrefix(globalPrefix);

  await app.listen(port);
}
bootstrap();
