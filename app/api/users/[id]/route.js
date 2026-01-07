import { NextResponse } from 'next/server';
import { requireAuth, hashPassword, verifyPassword } from '@/lib/auth';
import { getUserById, updateUser } from '@/lib/db';

/**
 * GET /api/users/[id]
 * Get user by ID
 */
export async function GET(request, { params }) {
  try {
    const session = await requireAuth();
    const { id } = params;

    // Users can only get their own data unless admin
    if (session.role !== 'admin' && session.id !== id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const user = getUserById(id);
    if (!user) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      );
    }

    const { password, ...userWithoutPassword } = user;
    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Get user error:', error);

    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data user' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/users/[id]
 * Update user
 */
export async function PUT(request, { params }) {
  try {
    const session = await requireAuth();
    const { id } = params;

    // Users can only update their own data unless admin
    if (session.role !== 'admin' && session.id !== id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const user = getUserById(id);
    if (!user) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { nama, telepon, alamat, fotoUrl, oldPassword, newPassword } = body;

    const updates = {};

    // Update basic info
    if (nama) updates.nama = nama;
    if (telepon) updates.telepon = telepon;
    if (alamat) updates.alamat = alamat;
    if (fotoUrl !== undefined) updates.fotoUrl = fotoUrl;

    // Change password if provided
    if (oldPassword && newPassword) {
      const isValid = await verifyPassword(oldPassword, user.password);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Password lama salah' },
          { status: 400 }
        );
      }

      const hashedPassword = await hashPassword(newPassword);
      updates.password = hashedPassword;
    }

    updateUser(id, updates);

    const updatedUser = getUserById(id);
    const { password, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      message: 'Profil berhasil diperbarui',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Update user error:', error);

    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memperbarui user' },
      { status: 500 }
    );
  }
}
