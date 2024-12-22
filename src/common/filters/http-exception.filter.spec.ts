import { HttpExceptionFilter } from './http-exception.filter';
import {
  ArgumentsHost,
  BadRequestException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { LoggerService } from '../../logger/logger.service';
import { ThrottlerException } from '@nestjs/throttler';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { Logger } from 'winston';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let logger: LoggerService;
  let mockArgumentsHost: ArgumentsHost;

  beforeEach(() => {
    const mockLogger: Logger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
      debug: jest.fn(),
    } as any;

    logger = new LoggerService(mockLogger);
    filter = new HttpExceptionFilter(logger);
    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({ url: '/test' }),
      getResponse: jest.fn().mockReturnValue({
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }),
    } as any;
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should handle BadRequestException', () => {
    const exception = new BadRequestException(['Validation error']);
    filter.catch(exception, mockArgumentsHost);

    const response = mockArgumentsHost.switchToHttp().getResponse();
    expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(response.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      message: [{ message: 'Validation error' }],
      error: 'Bad Request',
      timestamp: expect.any(String),
      path: '/test',
    });
  });

  it('should handle UnauthorizedException', () => {
    const exception = new UnauthorizedException();
    filter.catch(exception, mockArgumentsHost);

    const response = mockArgumentsHost.switchToHttp().getResponse();
    expect(response.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(response.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'Unauthorized',
      error: 'Unauthorized',
      timestamp: expect.any(String),
      path: '/test',
    });
  });

  it('should handle ThrottlerException', () => {
    const exception = new ThrottlerException('Too Many Requests');
    filter.catch(exception, mockArgumentsHost);

    const response = mockArgumentsHost.switchToHttp().getResponse();
    expect(response.status).toHaveBeenCalledWith(HttpStatus.TOO_MANY_REQUESTS);
    expect(response.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.TOO_MANY_REQUESTS,
      message: 'Too Many Requests',
      retryAfter: 60,
      timestamp: expect.any(String),
      path: '/test',
    });
  });

  it('should handle JsonWebTokenError', () => {
    const exception = new JsonWebTokenError('Invalid token');
    filter.catch(exception, mockArgumentsHost);

    const response = mockArgumentsHost.switchToHttp().getResponse();
    expect(response.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(response.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'Invalid or expired token',
      error: 'Unauthorized',
      timestamp: expect.any(String),
      path: '/test',
    });
  });

  it('should handle TokenExpiredError', () => {
    const exception = new TokenExpiredError('Token expired', new Date());
    filter.catch(exception, mockArgumentsHost);

    const response = mockArgumentsHost.switchToHttp().getResponse();
    expect(response.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(response.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'Invalid or expired token',
      error: 'Unauthorized',
      timestamp: expect.any(String),
      path: '/test',
    });
  });

  it('should handle unexpected errors', () => {
    const exception = new Error('Unexpected error');
    filter.catch(exception, mockArgumentsHost);

    const response = mockArgumentsHost.switchToHttp().getResponse();
    expect(response.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(response.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      error: 'Internal Server Error',
      details: {
        name: 'Error',
        message: 'Unexpected error',
      },
      timestamp: expect.any(String),
      path: '/test',
    });
  });
});
