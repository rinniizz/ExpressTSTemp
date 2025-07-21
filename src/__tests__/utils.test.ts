import { AuthUtils, ValidationUtils, ResponseUtils } from '../src/utils/helpers';

describe('AuthUtils', () => {
  describe('hashPassword', () => {
    it('should hash password correctly', async () => {
      const password = 'testPassword123';
      const hashedPassword = await AuthUtils.hashPassword(password);
      
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(typeof hashedPassword).toBe('string');
    });
  });

  describe('comparePassword', () => {
    it('should compare password correctly', async () => {
      const password = 'testPassword123';
      const hashedPassword = await AuthUtils.hashPassword(password);
      
      const isValid = await AuthUtils.comparePassword(password, hashedPassword);
      const isInvalid = await AuthUtils.comparePassword('wrongPassword', hashedPassword);
      
      expect(isValid).toBe(true);
      expect(isInvalid).toBe(false);
    });
  });

  describe('generateToken', () => {
    it('should generate JWT token', () => {
      const payload = {
        userId: 1,
        email: 'test@example.com',
        role: 'user' as any,
      };
      
      const token = AuthUtils.generateToken(payload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });
  });
});

describe('ValidationUtils', () => {
  describe('isValidEmail', () => {
    it('should validate email correctly', () => {
      expect(ValidationUtils.isValidEmail('test@example.com')).toBe(true);
      expect(ValidationUtils.isValidEmail('user.name+tag@domain.co.uk')).toBe(true);
      expect(ValidationUtils.isValidEmail('invalid-email')).toBe(false);
      expect(ValidationUtils.isValidEmail('test@')).toBe(false);
      expect(ValidationUtils.isValidEmail('@example.com')).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    it('should validate password correctly', () => {
      expect(ValidationUtils.isValidPassword('Password123')).toBe(true);
      expect(ValidationUtils.isValidPassword('ValidPass1')).toBe(true);
      expect(ValidationUtils.isValidPassword('password123')).toBe(false); // No uppercase
      expect(ValidationUtils.isValidPassword('PASSWORD123')).toBe(false); // No lowercase
      expect(ValidationUtils.isValidPassword('Password')).toBe(false); // No number
      expect(ValidationUtils.isValidPassword('Pass1')).toBe(false); // Too short
    });
  });

  describe('validatePagination', () => {
    it('should validate pagination parameters', () => {
      const result1 = ValidationUtils.validatePagination('1', '10');
      expect(result1).toEqual({ page: 1, limit: 10, offset: 0 });

      const result2 = ValidationUtils.validatePagination('2', '5');
      expect(result2).toEqual({ page: 2, limit: 5, offset: 5 });

      const result3 = ValidationUtils.validatePagination();
      expect(result3).toEqual({ page: 1, limit: 10, offset: 0 });

      const result4 = ValidationUtils.validatePagination('0', '150');
      expect(result4).toEqual({ page: 1, limit: 100, offset: 0 });
    });
  });
});
