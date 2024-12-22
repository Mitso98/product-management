import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../logger/logger.service';
import { ConflictException } from '@nestjs/common';
import { RegisterDto } from '../auth/dto/register.dto';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
          },
        },
        ConfigService,
        {
          provide: LoggerService,
          useValue: {
            error: jest.fn(),
            log: jest.fn(),
            warn: jest.fn(),
            info: jest.fn(),
            debug: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockReturnValue({
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: UserRole.USER,
      } as User);
      jest.spyOn(repository, 'save').mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: UserRole.USER,
      } as User);

      const result = await service.create(registerDto);

      expect(result).toEqual({
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: UserRole.USER,
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: UserRole.USER,
      } as User);

      await expect(service.create(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findOne', () => {
    it('should find a user by id', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: UserRole.USER,
      } as User;

      jest.spyOn(repository, 'findOne').mockResolvedValue(user);

      const result = await service.findOne('1');

      expect(result).toEqual(user);
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: UserRole.USER,
      } as User;

      jest.spyOn(repository, 'findOne').mockResolvedValue(user);

      const result = await service.findByEmail('test@example.com');

      expect(result).toEqual(user);
    });
  });
});
