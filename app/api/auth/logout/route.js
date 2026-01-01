import { NextResponse } from 'next/server';
import { destroySession } from '@/lib/auth';

/**
 * POST /api/auth/logout
 * Logout user
 */
export async function POST(request) {
  try {
    await destroySession();

    return NextResponse.json({
      message: 'Logout berhasil',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat logout' },
      { status: 500 }
    );
  }
}
