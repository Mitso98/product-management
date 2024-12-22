import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { UsersService } from '../../users/users.service';
import { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let usersService: UsersService;

  const mockConfigService = {
    get: jest.fn().mockReturnValue('your-very-secure-secret'),
  };

  const mockUsersService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should extract token from cookies', () => {
    const mockRequest = {
      cookies: {
        Authentication: 'test-token',
      },
    } as Partial<Request> as Request;

    const jwtExtractor = ExtractJwt.fromExtractors([
      (request: Request) => {
        return request?.cookies?.Authentication;
      },
    ]);

    expect(jwtExtractor(mockRequest)).toBe('test-token');
  });

  it('should validate user and return user object', async () => {
    const mockUser = { id: '1', email: 'test@example.com' };
    const payload = { sub: '1', email: 'test@example.com' };

    mockUsersService.findOne.mockResolvedValue(mockUser);

    const result = await strategy.validate(payload);

    expect(result).toEqual(mockUser);
    expect(usersService.findOne).toHaveBeenCalledWith(payload.sub);
  });

  it('should throw UnauthorizedException when user not found', async () => {
    const payload = { sub: '1', email: 'test@example.com' };

    mockUsersService.findOne.mockResolvedValue(null);

    await expect(strategy.validate(payload)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
