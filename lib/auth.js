import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { getUserByEmail, getUserById } from './db';

// ============================================================================
// PASSWORD OPERATIONS
// ============================================================================

/**
 * Hash password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

/**
 * Verify password against hash
 * @param {string} password - Plain text password
 * @param {string} hashedPassword - Hashed password
 * @returns {Promise<boolean>} True if password matches
 */
export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

// ============================================================================
// SESSION OPERATIONS
// ============================================================================

/**
 * Create session for user
 * @param {string} userId - User ID to create session for
 */
export async function createSession(userId) {
  const cookieStore = await cookies();
  cookieStore.set('session', userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
    sameSite: 'lax'
  });
}

/**
 * Get current session user
 * @returns {Promise<Object|null>} User object without password or null
 */
export async function getSession() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
      return null;
    }

    const user = getUserById(sessionCookie.value);

    if (!user) {
      return null;
    }

    // Don't return password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Destroy current session
 */
export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

// ============================================================================
// AUTHORIZATION HELPERS
// ============================================================================

/**
 * Require authentication (for API routes)
 * @returns {Promise<Object>} User object
 * @throws {Error} If not authenticated
 */
export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    throw new Error('Unauthorized');
  }

  return session;
}

/**
 * Require admin role (for API routes)
 * @returns {Promise<Object>} Admin user object
 * @throws {Error} If not authenticated or not admin
 */
export async function requireAdmin() {
  const session = await requireAuth();

  if (session.role !== 'admin') {
    throw new Error('Forbidden');
  }

  return session;
}

/**
 * Require member role (for API routes)
 * @returns {Promise<Object>} Member user object
 * @throws {Error} If not authenticated or not member
 */
export async function requireMember() {
  const session = await requireAuth();

  if (session.role !== 'member') {
    throw new Error('Forbidden');
  }

  return session;
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is valid
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and message
 */
export function validatePasswordStrength(password) {
  if (password.length < 6) {
    return {
      isValid: false,
      message: 'Password harus minimal 6 karakter'
    };
  }

  return {
    isValid: true,
    message: 'Password valid'
  };
}

/**
 * Authenticate user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object|null>} User object without password or null
 */
export async function authenticateUser(email, password) {
  const user = getUserByEmail(email);

  if (!user) {
    return null;
  }

  const isValid = await verifyPassword(password, user.password);

  if (!isValid) {
    return null;
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
