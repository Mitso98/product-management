import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { LoggerService } from '../../logger/logger.service';
import { ThrottlerException } from '@nestjs/throttler';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorResponse: any = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Handle validation errors (BadRequestException with validation details)
    if (exception instanceof BadRequestException) {
      status = HttpStatus.BAD_REQUEST;
      const response = exception.getResponse() as any;

      if (response.message && Array.isArray(response.message)) {
        errorResponse.message = response.message.map((error: any) => {
          if (typeof error === 'string') {
            return { message: error };
          }
          return {
            field: error.property,
            message: Object.values(error.constraints)[0],
          };
        });
        errorResponse.error = 'Bad Request';
      } else {
        errorResponse.message = response.message || 'Bad Request';
      }
    } else if (exception instanceof ThrottlerException) {
      status = HttpStatus.TOO_MANY_REQUESTS;
      errorResponse.message = 'Too Many Requests';
      const throttlerResponse = exception.getResponse() as any;
      errorResponse.retryAfter = throttlerResponse.retryAfter || 60;
    } else if (exception instanceof UnauthorizedException) {
      status = HttpStatus.UNAUTHORIZED;
      errorResponse.message = 'Unauthorized';
      errorResponse.error = 'Unauthorized';
    } else if (
      exception instanceof JsonWebTokenError ||
      exception instanceof TokenExpiredError
    ) {
      status = HttpStatus.UNAUTHORIZED;
      errorResponse.message = 'Invalid or expired token';
      errorResponse.error = 'Unauthorized';
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse() as any;
      errorResponse.message = response.message || exception.message;
      errorResponse.error = response.error || 'Error';
    } else {
      // Handle unexpected errors
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorResponse.message = 'Internal server error';
      errorResponse.error = 'Internal Server Error';

      // Add detailed error info in development
      if (process.env.NODE_ENV !== 'production') {
        errorResponse.details = {
          name: exception.name,
          message: exception.message,
        };
      }
    }

    errorResponse.statusCode = status;

    // Log the error
    this.logger.error(`${request.method} ${request.url}`, {
      status,
      message: errorResponse.message,
      stack:
        process.env.NODE_ENV !== 'production' ? exception.stack : undefined,
    });

    response.status(status).json(errorResponse);
  }
}
