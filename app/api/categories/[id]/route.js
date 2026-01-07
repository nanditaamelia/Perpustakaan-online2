import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import {
  getCategoryById,
  updateCategory,
  deleteCategory,
  categoryHasBooks,
} from '@/lib/db';

/**
 * PUT /api/categories/[id]
 * Update category (Admin only)
 */
export async function PUT(request, { params }) {
  try {
    await requireAdmin();

    const { id } = params;
    const body = await request.json();

    const category = getCategoryById(id);
    if (!category) {
      return NextResponse.json(
        { error: 'Kategori tidak ditemukan' },
        { status: 404 }
      );
    }

    const updatedCategory = updateCategory(id, body);

    return NextResponse.json({
      message: 'Kategori berhasil diperbarui',
      category: updatedCategory,
    });
  } catch (error) {
    console.error('Update category error:', error);

    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memperbarui kategori' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/categories/[id]
 * Delete category (Admin only)
 */
export async function DELETE(request, { params }) {
  try {
    await requireAdmin();

    const { id } = params;

    const category = getCategoryById(id);
    if (!category) {
      return NextResponse.json(
        { error: 'Kategori tidak ditemukan' },
        { status: 404 }
      );
    }

    if (categoryHasBooks(id)) {
      return NextResponse.json(
        { error: 'Kategori memiliki buku dan tidak dapat dihapus' },
        { status: 400 }
      );
    }

    deleteCategory(id);

    return NextResponse.json({
      message: 'Kategori berhasil dihapus',
    });
  } catch (error) {
    console.error('Delete category error:', error);

    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menghapus kategori' },
      { status: 500 }
    );
  }
}
