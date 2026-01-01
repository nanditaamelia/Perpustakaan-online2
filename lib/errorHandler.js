import { logError, logRequest } from './logger';

export class ApiError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'ApiError';
  }
}

export class ValidationError extends ApiError {
  constructor(message, details = null) {
    super(message, 400, details);
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends ApiError {
  constructor(message, details = null) {
    super(message, 409, details);
    this.name = 'ConflictError';
  }
}

export function handleError(error, req, res) {
  let statusCode = 500;
  let message = 'Internal server error';
  let details = null;

  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    details = error.details;
  } else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = error.message;
  }

  logError(error, {
    method: req.method,
    url: req.url,
    statusCode,
    ip: req.headers['x-forwarded-for'] || req.connection?.remoteAddress,
  });

  const response = {
    success: false,
    error: message,
  };

  if (details) {
    response.details = details;
  }

  if (process.env.NODE_ENV === 'development' && error.stack) {
    response.stack = error.stack;
  }

  return res.status(statusCode).json(response);
}

export function withErrorHandling(handler) {
  return async (req, res) => {
    const startTime = Date.now();
    try {
      await handler(req, res);
      const duration = Date.now() - startTime;
      logRequest(req, res.statusCode || 200, duration);
    } catch (error) {
      const duration = Date.now() - startTime;
      logRequest(req, error.statusCode || 500, duration);
      return handleError(error, req, res);
    }
  };
}

export function validateRequired(data, requiredFields) {
  const missing = [];

  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      missing.push(field);
    }
  }

  if (missing.length > 0) {
    throw new ValidationError(`Missing required fields: ${missing.join(', ')}`, { missing });
  }
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format');
  }
}

export function validateLength(value, field, min, max) {
  if (value.length < min) {
    throw new ValidationError(`${field} must be at least ${min} characters`);
  }
  if (max && value.length > max) {
    throw new ValidationError(`${field} must not exceed ${max} characters`);
  }
}

export default {
  ApiError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  handleError,
  withErrorHandling,
  validateRequired,
  validateEmail,
  validateLength,
};
