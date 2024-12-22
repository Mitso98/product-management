import { normalizeEmail } from './email.utils';

describe('normalizeEmail', () => {
  it('should return the same email if it is null or empty', () => {
    expect(normalizeEmail(null)).toBe(null);
    expect(normalizeEmail('')).toBe('');
  });

  it('should convert email to lowercase and trim whitespace', () => {
    expect(normalizeEmail('  TEST@EXAMPLE.COM  ')).toBe('test@example.com');
  });

  it('should normalize Gmail addresses by removing dots and everything after +', () => {
    expect(normalizeEmail('test.email+spam@gmail.com')).toBe(
      'testemail@gmail.com',
    );
    expect(normalizeEmail('test.email@gmail.com')).toBe('testemail@gmail.com');
    expect(normalizeEmail('test.email+spam@GMAIL.COM')).toBe(
      'testemail@gmail.com',
    );
  });

  it('should not alter non-Gmail addresses', () => {
    expect(normalizeEmail('test.email+spam@yahoo.com')).toBe(
      'test.email+spam@yahoo.com',
    );
    expect(normalizeEmail('test.email@yahoo.com')).toBe('test.email@yahoo.com');
  });
});
