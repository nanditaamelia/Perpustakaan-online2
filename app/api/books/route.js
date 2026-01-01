import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import {
  getBooks,
  addBook,
  generateId,
  getBooksWithCategory,
} from '@/lib/db';

/**
 * GET /api/books
 * Get all books
 */
export async function GET(request) {
  try {
    const books = getBooksWithCategory();

    return NextResponse.json({ books });
  } catch (error) {
    console.error('Get books error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data buku' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/books
 * Add new book (Admin only)
 */
export async function POST(request) {
  try {
    // Require admin
    await requireAdmin();

    const body = await request.json();
    const {
      judul,
      pengarang,
      penerbit,
      tahunTerbit,
      isbn,
      kategoriId,
      sinopsis,
      stokTotal,
      coverUrl,
    } = body;

    // Validate required fields
    if (!judul || !pengarang || !penerbit || !tahunTerbit || !isbn || !kategoriId) {
      return NextResponse.json(
        { error: 'Semua field wajib harus diisi' },
        { status: 400 }
      );
    }

    // Create new book
    const newBook = {
      id: generateId(),
      judul,
      pengarang,
      penerbit,
      tahunTerbit: parseInt(tahunTerbit),
      isbn,
      kategoriId,
      sinopsis: sinopsis || '',
      stokTotal: parseInt(stokTotal) || 1,
      stokTersedia: parseInt(stokTotal) || 1,
      coverUrl: coverUrl || null,
      createdAt: new Date().toISOString(),
    };

    addBook(newBook);

    return NextResponse.json(
      {
        message: 'Buku berhasil ditambahkan',
        book: newBook,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Add book error:', error);

    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menambah buku' },
      { status: 500 }
    );
  }
}
