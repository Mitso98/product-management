import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UserRole } from './entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  describe('getProfile', () => {
    it('should return user profile from request', () => {
      const mockRequest = {
        user: {
          id: '123',
          email: 'test@example.com',
          role: UserRole.USER,
        },
      };

      const result = controller.getProfile(mockRequest);
      expect(result).toEqual(mockRequest.user);
    });
  });

  describe('adminOnly', () => {
    it('should return admin only message', () => {
      const result = controller.adminOnly();
      expect(result).toBe('Admin only route');
    });
  });
});
