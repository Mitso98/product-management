import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { UserRole } from '../users/entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const expectedResult = {
        id: '123',
        email: 'test@example.com',
        role: UserRole.USER,
      };

      jest.spyOn(authService, 'register').mockResolvedValue(expectedResult);

      const result = await controller.register(registerDto);
      expect(result).toEqual(expectedResult);
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    it('should login user and set cookie', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response;

      const authServiceResponse = {
        token: 'jwt-token',
        user: {
          id: '123',
          email: 'test@example.com',
          role: UserRole.USER,
        },
      };

      // Mock auth service to return both token and user
      jest.spyOn(authService, 'login').mockResolvedValue(authServiceResponse);

      const result = await controller.login(loginDto, mockResponse);

      // Check that only user data is returned (no token)
      expect(result).toEqual({ user: authServiceResponse.user });

      // Verify cookie is set with correct parameters
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'Authentication',
        authServiceResponse.token,
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        },
      );
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });
});
