import { NextResponse } from 'next/server';
import { requireAuth, requireAdmin } from '@/lib/auth';
import {
  getLoans,
  addLoan,
  generateId,
  getLoansWithDetails,
  getActiveLoansByUserId,
  getBookById,
  updateBook,
} from '@/lib/db';
import { BUSINESS_RULES } from '@/lib/constants';

/**
 * GET /api/loans
 * Get loans (filtered by user if member)
 */
export async function GET(request) {
  try {
    const session = await requireAuth();

    let loans;
    if (session.role === 'admin') {
      loans = getLoansWithDetails();
    } else {
      // Member can only see their own loans
      const allLoans = getLoansWithDetails();
      loans = allLoans.filter((loan) => loan.userId === session.id);
    }

    return NextResponse.json({ loans });
  } catch (error) {
    console.error('Get loans error:', error);

    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data peminjaman' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/loans
 * Create new loan request (Member only)
 */
export async function POST(request) {
  try {
    const session = await requireAuth();

    // Only members can create loan requests
    if (session.role !== 'member') {
      return NextResponse.json(
        { error: 'Hanya member yang dapat membuat peminjaman' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { bookId } = body;

    if (!bookId) {
      return NextResponse.json(
        { error: 'Book ID harus diisi' },
        { status: 400 }
      );
    }

    // Check book availability
    const book = getBookById(bookId);
    if (!book) {
      return NextResponse.json(
        { error: 'Buku tidak ditemukan' },
        { status: 404 }
      );
    }

    if (book.stokTersedia < 1) {
      return NextResponse.json(
        { error: 'Buku tidak tersedia' },
        { status: 400 }
      );
    }

    // Check user's active loans
    const activeLoans = getActiveLoansByUserId(session.id);
    if (activeLoans.length >= BUSINESS_RULES.MAX_ACTIVE_LOANS) {
      return NextResponse.json(
        {
          error: `Anda sudah mencapai batas maksimal peminjaman (${BUSINESS_RULES.MAX_ACTIVE_LOANS} buku)`,
        },
        { status: 400 }
      );
    }

    // Create loan request
    const newLoan = {
      id: generateId(),
      userId: session.id,
      bookId,
      tanggalPinjam: new Date().toISOString(),
      tanggalHarusKembali: null, // Will be set when approved
      tanggalKembali: null,
      status: 'pending',
      diperpanjang: false,
      denda: 0,
      createdAt: new Date().toISOString(),
    };

    addLoan(newLoan);

    return NextResponse.json(
      {
        message: 'Peminjaman berhasil diajukan. Menunggu persetujuan admin.',
        loan: newLoan,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create loan error:', error);

    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Terjadi kesalahan saat membuat peminjaman' },
      { status: 500 }
    );
  }
}
