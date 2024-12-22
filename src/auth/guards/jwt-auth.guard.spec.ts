import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from './jwt-auth.guard';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

jest.mock('@nestjs/passport', () => ({
  AuthGuard: jest.fn(() => {
    return class {
      canActivate = jest.fn().mockResolvedValue(true);
    };
  }),
}));

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access to public routes', async () => {
    const context = createMockExecutionContext();
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should delegate to AuthGuard for protected routes', async () => {
    const context = createMockExecutionContext();
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
  });
});

function createMockExecutionContext(): ExecutionContext {
  return {
    switchToHttp: jest.fn().mockReturnThis(),
    getRequest: jest.fn().mockReturnValue({}),
    getHandler: jest.fn().mockReturnValue({}),
    getClass: jest.fn().mockReturnValue({}),
  } as unknown as ExecutionContext;
}
