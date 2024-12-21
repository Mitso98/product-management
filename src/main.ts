import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import {
  AppConfigInterface,
  ConfigurationInterface,
} from './config/environmentVariables/configurationInterface.interface';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService =
    app.get<ConfigService<ConfigurationInterface>>(ConfigService);
  const appVars = configService.get<AppConfigInterface>('app');

  app.setGlobalPrefix(appVars.GLOBAL_PREFIX);

  // Helmet Security Headers
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        },
      },
    }),
  );

  // CORS Configuration
  app.enableCors({
    origin: appVars.NODE_ENV === 'development' ? '*' : appVars.ALLOWED_ORIGINS,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  app.set('trust proxy', 'loopback');

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

  // Enable API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: '1',
  });

  const config = new DocumentBuilder()
    .setTitle('Product Management API')
    .setDescription('Product Management System API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(`http://localhost:${appVars.PORT}`)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${appVars.GLOBAL_PREFIX}/docs`, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      explorer: true,
    },
  });

  await app.listen(appVars.PORT);
}
bootstrap();
