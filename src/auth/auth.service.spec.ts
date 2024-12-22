import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../logger/logger.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { User, UserRole } from '../users/entities/user.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const createMockUser = (overrides = {}) =>
    ({
      id: '123',
      email: 'test@example.com',
      password: 'hashedPassword',
      role: UserRole.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
      normalizeEmail: jest.fn(),
      hashPassword: jest.fn(),
      validatePassword: jest.fn(),
      ...overrides,
    }) as User;

  const mockUser = createMockUser();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test-token'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(usersService, 'create').mockResolvedValue(mockUser);

      const result = await authService.register(registerDto);

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      });
      expect(usersService.create).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('register', () => {
    it('should throw ConflictException when user already exists', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      jest
        .spyOn(usersService, 'create')
        .mockRejectedValue(new ConflictException());

      await expect(authService.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should handle password hashing failure', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      jest
        .spyOn(usersService, 'create')
        .mockRejectedValue(new Error('Hashing failed'));

      await expect(authService.register(registerDto)).rejects.toThrow(Error);
    });
  });

  describe('login', () => {
    it('should successfully login a user', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser);
      jest.spyOn(mockUser, 'validatePassword').mockResolvedValue(true);

      const result = await authService.login(loginDto);

      expect(result).toEqual({
        token: 'test-token',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          role: mockUser.role,
        },
      });
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      const loginDto = {
        email: 'wrong@example.com',
        password: 'password123',
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser);
      jest.spyOn(mockUser, 'validatePassword').mockResolvedValue(false);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
