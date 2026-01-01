import { NextResponse } from 'next/server';
import { withErrorHandling } from './errorHandler';
import { rateLimit } from './rateLimit';
import { logRequest } from './logger';

export function createApiHandler(handler, options = {}) {
  const { enableRateLimit = true, enableLogging = true } = options;

  return async (request) => {
    const startTime = Date.now();

    const mockRes = {
      statusCode: 200,
      headers: {},
      setHeader(name, value) {
        this.headers[name] = value;
      },
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        const response = NextResponse.json(data, {
          status: this.statusCode,
          headers: this.headers,
        });
        return response;
      },
    };

    if (enableRateLimit) {
      const rateLimitResult = rateLimit(request);

      mockRes.setHeader('X-RateLimit-Limit', process.env.RATE_LIMIT_MAX || 100);
      mockRes.setHeader('X-RateLimit-Remaining', rateLimitResult.remaining);
      mockRes.setHeader('X-RateLimit-Reset', rateLimitResult.resetTime.toISOString());

      if (!rateLimitResult.allowed) {
        mockRes.setHeader('Retry-After', rateLimitResult.retryAfter);
        const duration = Date.now() - startTime;
        if (enableLogging) {
          logRequest(request, 429, duration);
        }
        return NextResponse.json(
          {
            success: false,
            error: 'Too many requests. Please try again later.',
            retryAfter: rateLimitResult.retryAfter,
          },
          {
            status: 429,
            headers: mockRes.headers,
          }
        );
      }
    }

    try {
      const response = await handler(request, mockRes);

      const duration = Date.now() - startTime;
      if (enableLogging) {
        logRequest(request, mockRes.statusCode, duration);
      }

      if (response instanceof NextResponse) {
        Object.entries(mockRes.headers).forEach(([key, value]) => {
          response.headers.set(key, value);
        });
        return response;
      }

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      if (enableLogging) {
        logRequest(request, error.statusCode || 500, duration);
      }

      const errorHandler = withErrorHandling(async () => {
        throw error;
      });

      return errorHandler(request, mockRes);
    }
  };
}

export function apiRoute(handler, options) {
  return createApiHandler(handler, options);
}

export default apiRoute;
