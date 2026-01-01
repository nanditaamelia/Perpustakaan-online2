import { NextResponse } from 'next/server';
import { requireAdmin, getSession } from '@/lib/auth';
import { getUsers } from '@/lib/db';

/**
 * GET /api/users
 * Get all users (Admin) or current user (Member)
 */
export async function GET(request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.role === 'admin') {
      // Admin can see all users
      const users = getUsers();
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      return NextResponse.json({ users: usersWithoutPasswords });
    } else {
      // Member can only see themselves
      return NextResponse.json({ user: session });
    }
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data user' },
      { status: 500 }
    );
  }
}
