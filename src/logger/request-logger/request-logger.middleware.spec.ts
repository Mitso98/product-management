import { RequestLoggerMiddleware } from './request-logger.middleware';
import { Request, Response, NextFunction } from 'express';

describe('RequestLoggerMiddleware', () => {
  let loggerService: any;
  let middleware: RequestLoggerMiddleware;
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    loggerService = { log: jest.fn(), info: jest.fn() } as any;
    middleware = new RequestLoggerMiddleware(loggerService);
    req = {
      method: 'GET',
      originalUrl: '/test',
      headers: { 'user-agent': 'jest' },
      ip: '127.0.0.1',
      get: jest.fn().mockReturnValue('jest'),
    } as any;
    res = {
      on: jest.fn((event, callback) => callback()),
      statusCode: 200,
    } as any;
    next = jest.fn();
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should log request details', () => {
    middleware.use(req, res, next);
    expect(loggerService.info).toHaveBeenCalledWith('HTTP Request', {
      method: 'GET',
      url: '/test',
      statusCode: 200,
      responseTime: expect.any(Number),
      userAgent: 'jest',
      ip: '127.0.0.1',
    });
    expect(next).toHaveBeenCalled();
  });

  it('should handle response finish event', () => {
    const onSpy = jest.spyOn(res, 'on');
    middleware.use(req, res, next);
    expect(onSpy).toHaveBeenCalledWith('finish', expect.any(Function));
  });

  it('should log with different status codes', () => {
    res.statusCode = 404;
    middleware.use(req, res, next);
    expect(loggerService.info).toHaveBeenCalledWith('HTTP Request', {
      method: 'GET',
      url: '/test',
      statusCode: 404,
      responseTime: expect.any(Number),
      userAgent: 'jest',
      ip: '127.0.0.1',
    });
  });
});
