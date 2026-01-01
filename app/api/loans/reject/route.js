import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getLoanById, updateLoan } from '@/lib/db';

/**
 * POST /api/loans/reject
 * Reject loan request (Admin only)
 */
export async function POST(request) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { loanId } = body;

    if (!loanId) {
      return NextResponse.json(
        { error: 'Loan ID harus diisi' },
        { status: 400 }
      );
    }

    // Get loan
    const loan = getLoanById(loanId);
    if (!loan) {
      return NextResponse.json(
        { error: 'Peminjaman tidak ditemukan' },
        { status: 404 }
      );
    }

    // Check if loan is pending
    if (loan.status !== 'pending') {
      return NextResponse.json(
        { error: 'Peminjaman sudah diproses' },
        { status: 400 }
      );
    }

    // Update loan
    updateLoan(loanId, {
      status: 'rejected',
    });

    return NextResponse.json({
      message: 'Peminjaman berhasil ditolak',
    });
  } catch (error) {
    console.error('Reject loan error:', error);

    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menolak peminjaman' },
      { status: 500 }
    );
  }
}
