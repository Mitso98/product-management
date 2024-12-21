import { RequestLoggerMiddleware } from './request-logger.middleware';

describe('RequestLoggerMiddleware', () => {
  it('should be defined', () => {
    const loggerService = { log: jest.fn() } as any;
    expect(new RequestLoggerMiddleware(loggerService)).toBeDefined();
  });
});
