import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import {
  getLoanById,
  updateLoan,
  getBookById,
  updateBook,
  calculateDenda,
} from '@/lib/db';

/**
 * POST /api/loans/return
 * Mark loan as returned (Admin only)
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

    // Check if loan is approved
    if (loan.status !== 'approved') {
      return NextResponse.json(
        { error: 'Peminjaman tidak dalam status dipinjam' },
        { status: 400 }
      );
    }

    // Calculate fine
    const denda = calculateDenda(loan.tanggalHarusKembali);

    // Update loan
    updateLoan(loanId, {
      status: 'returned',
      tanggalKembali: new Date().toISOString(),
      denda,
    });

    // Increase book stock
    const book = getBookById(loan.bookId);
    if (book) {
      updateBook(loan.bookId, {
        stokTersedia: book.stokTersedia + 1,
      });
    }

    return NextResponse.json({
      message: denda > 0
        ? `Buku berhasil dikembalikan dengan denda Rp ${denda.toLocaleString('id-ID')}`
        : 'Buku berhasil dikembalikan',
      denda,
    });
  } catch (error) {
    console.error('Return loan error:', error);

    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengembalikan buku' },
      { status: 500 }
    );
  }
}
