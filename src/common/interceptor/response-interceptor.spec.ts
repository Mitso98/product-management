import { ResponseInterceptor } from './response-interceptor';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';

describe('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor<any>;

  beforeEach(() => {
    interceptor = new ResponseInterceptor<any>();
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should intercept and transform response', async () => {
    const mockExecutionContext: ExecutionContext = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({ url: '/test' }),
      getResponse: jest.fn().mockReturnValue({ statusCode: 200 }),
    } as any;

    const next: CallHandler = {
      handle: jest.fn().mockReturnValue(of({ data: 'test' })),
    };

    const result$ = interceptor.intercept(mockExecutionContext, next);

    result$.subscribe((result) => {
      expect(result).toEqual({
        data: { data: 'test' },
        statusCode: 200,
        timestamp: expect.any(String),
        path: '/test',
      });
    });
  });

  it('should handle empty response', async () => {
    const mockExecutionContext: ExecutionContext = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({ url: '/test' }),
      getResponse: jest.fn().mockReturnValue({ statusCode: 204 }),
    } as any;

    const next: CallHandler = {
      handle: jest.fn().mockReturnValue(of(null)),
    };

    const result$ = interceptor.intercept(mockExecutionContext, next);

    result$.subscribe((result) => {
      expect(result).toEqual({
        data: null,
        statusCode: 204,
        timestamp: expect.any(String),
        path: '/test',
      });
    });
  });
});
