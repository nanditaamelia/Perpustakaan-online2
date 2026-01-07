import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getStatistics } from '@/lib/db';

/**
 * GET /api/stats
 * Get statistics (Admin only)
 */
export async function GET(request) {
  try {
    // Require admin
    await requireAdmin();

    const stats = getStatistics();

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Get statistics error:', error);

    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil statistik' },
      { status: 500 }
    );
  }
}
