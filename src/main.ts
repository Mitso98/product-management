import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import {
  AppConfigInterface,
  ConfigurationInterface,
} from './config/environmentVariables/configurationInterface.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService =
    app.get<ConfigService<ConfigurationInterface>>(ConfigService);
  const appVars = configService.get<AppConfigInterface>('app');

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip non-whitelisted properties
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Helmet Security Headers
  app.use(helmet());

  // CORS Configuration
  app.enableCors({
    origin: appVars.NODE_ENV === 'development' ? '*' : appVars.ALLOWED_ORIGINS,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  app.setGlobalPrefix(appVars.GLOBAL_PREFIX);

  await app.listen(appVars.PORT);
}
bootstrap();
