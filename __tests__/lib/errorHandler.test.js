import {
  ValidationError,
  UnauthorizedError,
  NotFoundError,
  validateRequired,
  validateEmail,
  validateLength,
} from '@/lib/errorHandler';

describe('Error Classes', () => {
  describe('ValidationError', () => {
    it('should create error with correct properties', () => {
      const error = new ValidationError('Invalid input', { field: 'email' });
      expect(error.message).toBe('Invalid input');
      expect(error.statusCode).toBe(400);
      expect(error.details).toEqual({ field: 'email' });
      expect(error.name).toBe('ValidationError');
    });
  });

  describe('UnauthorizedError', () => {
    it('should create error with default message', () => {
      const error = new UnauthorizedError();
      expect(error.message).toBe('Unauthorized');
      expect(error.statusCode).toBe(401);
    });

    it('should create error with custom message', () => {
      const error = new UnauthorizedError('Invalid token');
      expect(error.message).toBe('Invalid token');
      expect(error.statusCode).toBe(401);
    });
  });

  describe('NotFoundError', () => {
    it('should create error with default message', () => {
      const error = new NotFoundError();
      expect(error.message).toBe('Resource not found');
      expect(error.statusCode).toBe(404);
    });
  });
});

describe('Validation Functions', () => {
  describe('validateRequired', () => {
    it('should pass when all required fields are present', () => {
      const data = { name: 'Test', email: 'test@example.com' };
      expect(() => validateRequired(data, ['name', 'email'])).not.toThrow();
    });

    it('should throw when required field is missing', () => {
      const data = { name: 'Test' };
      expect(() => validateRequired(data, ['name', 'email'])).toThrow(ValidationError);
      expect(() => validateRequired(data, ['name', 'email'])).toThrow('Missing required fields: email');
    });

    it('should throw when required field is empty string', () => {
      const data = { name: 'Test', email: '  ' };
      expect(() => validateRequired(data, ['name', 'email'])).toThrow(ValidationError);
    });
  });

  describe('validateEmail', () => {
    it('should pass for valid email', () => {
      expect(() => validateEmail('test@example.com')).not.toThrow();
      expect(() => validateEmail('user.name+tag@example.co.uk')).not.toThrow();
    });

    it('should throw for invalid email', () => {
      expect(() => validateEmail('invalid')).toThrow(ValidationError);
      expect(() => validateEmail('invalid@')).toThrow(ValidationError);
      expect(() => validateEmail('@example.com')).toThrow(ValidationError);
      expect(() => validateEmail('test@')).toThrow(ValidationError);
    });
  });

  describe('validateLength', () => {
    it('should pass when length is within range', () => {
      expect(() => validateLength('password123', 'password', 6, 20)).not.toThrow();
    });

    it('should throw when length is too short', () => {
      expect(() => validateLength('pass', 'password', 6, 20)).toThrow(ValidationError);
      expect(() => validateLength('pass', 'password', 6, 20)).toThrow('password must be at least 6 characters');
    });

    it('should throw when length is too long', () => {
      const longString = 'a'.repeat(30);
      expect(() => validateLength(longString, 'password', 6, 20)).toThrow(ValidationError);
      expect(() => validateLength(longString, 'password', 6, 20)).toThrow('password must not exceed 20 characters');
    });

    it('should work without max length', () => {
      const longString = 'a'.repeat(100);
      expect(() => validateLength(longString, 'text', 6)).not.toThrow();
    });
  });
});
