import { NextResponse } from 'next/server';
import { authenticateUser, createSession } from '@/lib/auth';
import { withErrorHandling, ValidationError, UnauthorizedError, validateRequired, validateEmail } from '@/lib/errorHandler';
import { rateLimitMiddleware } from '@/lib/rateLimit';
import { logInfo, logWarn } from '@/lib/logger';

/**
 * POST /api/auth/login
 * Login user with rate limiting and comprehensive error handling
 */
async function handler(request) {
  const body = await request.json();
  const { email, password } = body;

  validateRequired(body, ['email', 'password']);
  validateEmail(email);

  const user = await authenticateUser(email, password);

  if (!user) {
    logWarn('Failed login attempt', { email });
    throw new UnauthorizedError('Email atau password salah');
  }

  await createSession(user.id);

  logInfo('User logged in successfully', {
    userId: user.id,
    email: user.email,
    role: user.role
  });

  return NextResponse.json({
    success: true,
    message: 'Login berhasil',
    user: {
      id: user.id,
      email: user.email,
      nama: user.nama,
      role: user.role,
    },
  });
}

export async function POST(request) {
  return rateLimitMiddleware(withErrorHandling(handler))(request, {
    json: (data) => NextResponse.json(data, { status: data.success ? 200 : data.statusCode || 500 }),
    status: (code) => ({
      json: (data) => NextResponse.json(data, { status: code }),
    }),
    setHeader: () => {},
  });
}
