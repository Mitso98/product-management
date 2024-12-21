import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { LoggerService } from '../../logger/logger.service';
import { ThrottlerException } from '@nestjs/throttler';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof ThrottlerException
        ? 'Too Many Requests'
        : exception instanceof HttpException
          ? exception.message
          : 'Internal server error';

    // Log the error
    this.logger.error(`${request.method} ${request.url}`, {
      status,
      message,
      stack: exception.stack,
    });

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      ...(status === 429 && {
        retryAfter: exception.getResponse()?.retryAfter || 60,
      }),
    });
  }
}
