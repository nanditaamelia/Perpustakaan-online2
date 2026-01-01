import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import {
  getLoanById,
  updateLoan,
  getBookById,
  updateBook,
} from '@/lib/db';
import { addDays } from '@/lib/utils';
import { BUSINESS_RULES } from '@/lib/constants';

/**
 * POST /api/loans/approve
 * Approve loan request (Admin only)
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

    // Check book availability
    const book = getBookById(loan.bookId);
    if (!book || book.stokTersedia < 1) {
      return NextResponse.json(
        { error: 'Buku tidak tersedia' },
        { status: 400 }
      );
    }

    // Set deadline (7 days from now)
    const deadline = addDays(new Date(), BUSINESS_RULES.LOAN_DURATION_DAYS);

    // Update loan
    updateLoan(loanId, {
      status: 'approved',
      tanggalHarusKembali: deadline.toISOString(),
    });

    // Decrease book stock
    updateBook(loan.bookId, {
      stokTersedia: book.stokTersedia - 1,
    });

    return NextResponse.json({
      message: 'Peminjaman berhasil disetujui',
    });
  } catch (error) {
    console.error('Approve loan error:', error);

    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menyetujui peminjaman' },
      { status: 500 }
    );
  }
}
