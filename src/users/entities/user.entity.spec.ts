import { User, UserRole } from './user.entity';
import * as bcrypt from 'bcrypt';
import { normalizeEmail } from '../../common/utils/email.utils';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

describe('UserEntity', () => {
  it('should be defined', () => {
    expect(new User()).toBeDefined();
  });

  it('should normalize email before insert and update', async () => {
    const user = new User();
    user.email = 'TEST@EXAMPLE.COM';
    await user.normalizeEmail();
    expect(user.email).toBe('test@example.com');
  });

  it('should hash password before insert', async () => {
    const user = new User();
    user.password = 'password123';
    await user.hashPassword();
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    expect(user.password).toBe('hashedPassword');
  });

  it('should validate password correctly', async () => {
    const user = new User();
    user.password = 'hashedPassword';
    const isValid = await user.validatePassword('password123');
    expect(bcrypt.compare).toHaveBeenCalledWith(
      'password123',
      'hashedPassword',
    );
    expect(isValid).toBe(true);
  });
});
