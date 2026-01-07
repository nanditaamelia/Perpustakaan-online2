import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getLoanById, updateLoan } from '@/lib/db';
import { addDays } from '@/lib/utils';
import { BUSINESS_RULES } from '@/lib/constants';

/**
 * POST /api/loans/extend
 * Extend loan duration (Member only)
 */
export async function POST(request) {
  try {
    const session = await requireAuth();

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

    // Check ownership
    if (loan.userId !== session.id) {
      return NextResponse.json(
        { error: 'Anda tidak memiliki akses ke peminjaman ini' },
        { status: 403 }
      );
    }

    // Check if loan is approved
    if (loan.status !== 'approved') {
      return NextResponse.json(
        { error: 'Peminjaman tidak dalam status dipinjam' },
        { status: 400 }
      );
    }

    // Check if already extended
    if (loan.diperpanjang) {
      return NextResponse.json(
        { error: 'Peminjaman sudah pernah diperpanjang' },
        { status: 400 }
      );
    }

    // Check if deadline has passed
    const now = new Date();
    const deadline = new Date(loan.tanggalHarusKembali);
    if (now > deadline) {
      return NextResponse.json(
        { error: 'Batas waktu perpanjangan sudah lewat' },
        { status: 400 }
      );
    }

    // Extend deadline (add 7 more days)
    const newDeadline = addDays(deadline, BUSINESS_RULES.LOAN_DURATION_DAYS);

    // Update loan
    updateLoan(loanId, {
      tanggalHarusKembali: newDeadline.toISOString(),
      diperpanjang: true,
    });

    return NextResponse.json({
      message: 'Peminjaman berhasil diperpanjang',
    });
  } catch (error) {
    console.error('Extend loan error:', error);

    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memperpanjang peminjaman' },
      { status: 500 }
    );
  }
}
