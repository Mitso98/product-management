import 'reflect-metadata';
import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY, Roles } from './roles.decorator';
import { UserRole } from '../../users/entities/user.entity';

jest.mock('@nestjs/common', () => ({
  SetMetadata: jest.fn().mockImplementation((key, value) => {
    return (target: any, propertyKey: string) => {
      Reflect.defineMetadata(key, value, target, propertyKey);
    };
  }),
}));

describe('RolesDecorator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(Roles).toBeDefined();
  });

  it('should call SetMetadata with roles', () => {
    const roles = [UserRole.ADMIN];
    Roles(...roles);
    expect(SetMetadata).toHaveBeenCalledWith(ROLES_KEY, roles);
  });

  it('should call SetMetadata with multiple roles', () => {
    const roles = [UserRole.ADMIN, UserRole.USER];
    Roles(...roles);
    expect(SetMetadata).toHaveBeenCalledWith(ROLES_KEY, roles);
  });

  it('should call SetMetadata with empty roles array', () => {
    const roles: UserRole[] = [];
    Roles(...roles);
    expect(SetMetadata).toHaveBeenCalledWith(ROLES_KEY, roles);
  });
});
