import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { ConfigService } from '@nestjs/config';
import { Environment } from 'src/config/environmentVariables/environment.constants';

export class LoggerConfig {
  static create(configService: ConfigService) {
    const environment = configService.get<Environment>('app.NODE_ENV');

    const defaultFormat = winston.format.combine(
      winston.format.timestamp(),
      winston.format.metadata({
        fillExcept: ['timestamp', 'level', 'message'],
      }),
      winston.format.json(),
    );

    const consoleFormat = winston.format.combine(
      winston.format.timestamp(),
      winston.format.ms(),
      nestWinstonModuleUtilities.format.nestLike('ProductManagement', {
        colors: true,
        prettyPrint: true,
      }),
    );

    const transports: winston.transport[] = [
      // Console transport with pretty printing for development
      new winston.transports.Console({
        format: consoleFormat,
        level: environment === Environment.DEVELOPMENT ? 'debug' : 'info',
      }),

      // Error logs with daily rotation
      new winston.transports.DailyRotateFile({
        filename: 'logs/error-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        level: 'error',
        format: defaultFormat,
      }),

      // All logs with daily rotation
      new winston.transports.DailyRotateFile({
        filename: 'logs/application-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: defaultFormat,
      }),
    ];

    return {
      // Default log level based on environment
      level: environment === Environment.DEVELOPMENT ? 'debug' : 'info',

      // Log format configuration
      format: defaultFormat,

      // Configure transports
      transports,

      // Exit on error: false to prevent process exit on error
      exitOnError: false,

      // Remove rejected promise warnings
      rejectionHandlers: [
        new winston.transports.File({
          filename: 'logs/rejections.log',
          format: defaultFormat,
        }),
      ],
    };
  }
}
