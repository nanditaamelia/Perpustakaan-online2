import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import {
  getBookById,
  updateBook,
  deleteBook,
  hasActiveLoans,
} from '@/lib/db';

/**
 * GET /api/books/[id]
 * Get book by ID
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const book = getBookById(id);

    if (!book) {
      return NextResponse.json(
        { error: 'Buku tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({ book });
  } catch (error) {
    console.error('Get book error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data buku' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/books/[id]
 * Update book (Admin only)
 */
export async function PUT(request, { params }) {
  try {
    // Require admin
    await requireAdmin();

    const { id } = params;
    const body = await request.json();

    // Check if book exists
    const existingBook = getBookById(id);
    if (!existingBook) {
      return NextResponse.json(
        { error: 'Buku tidak ditemukan' },
        { status: 404 }
      );
    }

    // Calculate stokTersedia based on new stokTotal
    let stokTersedia = existingBook.stokTersedia;
    if (body.stokTotal !== undefined) {
      const diff = parseInt(body.stokTotal) - existingBook.stokTotal;
      stokTersedia = existingBook.stokTersedia + diff;

      // Ensure stokTersedia doesn't go negative
      if (stokTersedia < 0) {
        stokTersedia = 0;
      }
    }

    // Update book
    const updatedData = {
      ...body,
      stokTotal: body.stokTotal !== undefined ? parseInt(body.stokTotal) : existingBook.stokTotal,
      stokTersedia,
      tahunTerbit: body.tahunTerbit !== undefined ? parseInt(body.tahunTerbit) : existingBook.tahunTerbit,
    };

    const updatedBook = updateBook(id, updatedData);

    return NextResponse.json({
      message: 'Buku berhasil diperbarui',
      book: updatedBook,
    });
  } catch (error) {
    console.error('Update book error:', error);

    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memperbarui buku' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/books/[id]
 * Delete book (Admin only)
 */
export async function DELETE(request, { params }) {
  try {
    // Require admin
    await requireAdmin();

    const { id } = params;

    // Check if book exists
    const book = getBookById(id);
    if (!book) {
      return NextResponse.json(
        { error: 'Buku tidak ditemukan' },
        { status: 404 }
      );
    }

    // Check if book has active loans
    if (hasActiveLoans(id)) {
      return NextResponse.json(
        { error: 'Buku sedang dipinjam dan tidak dapat dihapus' },
        { status: 400 }
      );
    }

    deleteBook(id);

    return NextResponse.json({
      message: 'Buku berhasil dihapus',
    });
  } catch (error) {
    console.error('Delete book error:', error);

    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menghapus buku' },
      { status: 500 }
    );
  }
}
