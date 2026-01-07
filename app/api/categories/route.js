import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getCategories, addCategory, generateId } from '@/lib/db';

/**
 * GET /api/categories
 * Get all categories
 */
export async function GET(request) {
  try {
    const categories = getCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data kategori' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/categories
 * Add new category (Admin only)
 */
export async function POST(request) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { namaKategori, deskripsi, color } = body;

    if (!namaKategori) {
      return NextResponse.json(
        { error: 'Nama kategori harus diisi' },
        { status: 400 }
      );
    }

    const newCategory = {
      id: generateId(),
      namaKategori,
      deskripsi: deskripsi || '',
      color: color || '#3b82f6',
      createdAt: new Date().toISOString(),
    };

    addCategory(newCategory);

    return NextResponse.json(
      {
        message: 'Kategori berhasil ditambahkan',
        category: newCategory,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Add category error:', error);

    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menambah kategori' },
      { status: 500 }
    );
  }
}
