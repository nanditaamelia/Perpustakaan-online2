import { NextResponse } from 'next/server';
import { hashPassword, isValidEmail, validatePasswordStrength } from '@/lib/auth';
import {
  getUserByEmail,
  addUser,
  generateMemberNumber,
  generateId,
} from '@/lib/db';

/**
 * POST /api/auth/register
 * Register new user
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, confirmPassword, nama, telepon, alamat } = body;

    // Validate input
    if (!email || !password || !confirmPassword || !nama || !telepon || !alamat) {
      return NextResponse.json(
        { error: 'Semua field harus diisi' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Format email tidak valid' },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400 }
      );
    }

    // Check password confirmation
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Password tidak cocok' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate member number
    const noAnggota = generateMemberNumber();

    // Create new user
    const newUser = {
      id: generateId(),
      email,
      password: hashedPassword,
      nama,
      role: 'member',
      noAnggota,
      telepon,
      alamat,
      fotoUrl: null,
      createdAt: new Date().toISOString(),
    };

    addUser(newUser);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      message: 'Registrasi berhasil! Silakan login.',
      user: userWithoutPassword,
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat registrasi' },
      { status: 500 }
    );
  }
}
