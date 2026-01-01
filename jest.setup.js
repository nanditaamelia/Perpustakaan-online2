import '@testing-library/jest-dom';

global.fetch = jest.fn();

process.env.NODE_ENV = 'test';
process.env.SESSION_SECRET = 'test-secret';
process.env.JWT_SECRET = 'test-jwt-secret';
