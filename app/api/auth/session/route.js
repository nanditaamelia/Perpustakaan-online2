import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

/**
 * GET /api/auth/session
 * Get current user session
 */
export async function GET(request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Tidak ada sesi aktif' },
        { status: 401 }
      );
    }

    return NextResponse.json({ user: session });
  } catch (error) {
    console.error('Get session error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil sesi' },
      { status: 500 }
    );
  }
}
