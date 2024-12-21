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
import * as compression from 'compression';
import { ResponseInterceptor } from './common/interceptor/response-interceptor';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService =
    app.get<ConfigService<ConfigurationInterface>>(ConfigService);
  const appVars = configService.get<AppConfigInterface>('app');

  app.setGlobalPrefix(appVars.GLOBAL_PREFIX);

  app.use(compression());

  // Helmet Security Headers
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          scriptSrc: ["'self'"],
        },
      },
    }),
  );

  app.use(cookieParser());

  app.set('trust proxy', 'loopback');

  app.useGlobalInterceptors(new ResponseInterceptor());

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

  app.enableCors({
    origin: appVars.NODE_ENV === 'development' ? '*' : appVars.ALLOWED_ORIGINS,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  // Enable API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: appVars.API_VERSION_PREFIX,
    defaultVersion: appVars.API_DEFAULT_VERSION,
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
