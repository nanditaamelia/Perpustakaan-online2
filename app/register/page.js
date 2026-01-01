'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Library, Mail, Lock, User, Phone, MapPin, CheckCircle2, XCircle } from 'lucide-react';
import Input, { Textarea } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import toast from 'react-hot-toast';
import { PATTERNS } from '@/lib/constants';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    confirmPassword: '',
    telepon: '',
    alamat: '',
  });
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: '',
    color: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Check password strength when password field changes
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    let score = 0;
    let label = '';
    let color = '';

    if (password.length === 0) {
      setPasswordStrength({ score: 0, label: '', color: '' });
      return;
    }

    // Length check
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;

    // Contains number
    if (/\d/.test(password)) score++;

    // Contains lowercase and uppercase
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;

    // Contains special character
    if (/[^A-Za-z0-9]/.test(password)) score++;

    // Determine label and color based on score
    if (score <= 1) {
      label = 'Lemah';
      color = 'red';
    } else if (score <= 2) {
      label = 'Sedang';
      color = 'yellow';
    } else if (score <= 3) {
      label = 'Kuat';
      color = 'blue';
    } else {
      label = 'Sangat Kuat';
      color = 'green';
    }

    setPasswordStrength({ score, label, color });
  };

  const validate = () => {
    // Name validation
    if (!formData.nama.trim()) {
      toast.error('Nama harus diisi');
      return false;
    }

    // Email validation
    if (!formData.email.trim()) {
      toast.error('Email harus diisi');
      return false;
    }
    if (!PATTERNS.EMAIL.test(formData.email)) {
      toast.error('Format email tidak valid');
      return false;
    }

    // Password validation
    if (!formData.password) {
      toast.error('Password harus diisi');
      return false;
    }
    if (formData.password.length < 6) {
      toast.error('Password minimal 6 karakter');
      return false;
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Password tidak cocok');
      return false;
    }

    // Phone validation
    if (!formData.telepon.trim()) {
      toast.error('Nomor telepon harus diisi');
      return false;
    }
    if (!PATTERNS.PHONE.test(formData.telepon)) {
      toast.error('Format nomor telepon tidak valid (08xx atau 62xxx)');
      return false;
    }

    // Address validation
    if (!formData.alamat.trim()) {
      toast.error('Alamat harus diisi');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: formData.nama,
          email: formData.email,
          password: formData.password,
          telepon: formData.telepon,
          alamat: formData.alamat,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Registrasi gagal');
        return;
      }

      toast.success('Registrasi berhasil! Silakan login.');
      router.push('/login');
    } catch (error) {
      toast.error('Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthIndicator = () => {
    if (!passwordStrength.label) return null;

    const widthMap = {
      0: '0%',
      1: '25%',
      2: '50%',
      3: '75%',
      4: '100%',
      5: '100%',
    };

    const bgColorMap = {
      red: 'bg-red-500',
      yellow: 'bg-yellow-500',
      blue: 'bg-blue-500',
      green: 'bg-green-500',
    };

    return (
      <div className="mt-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Kekuatan Password:
          </span>
          <span className={`text-xs font-medium text-${passwordStrength.color}-600 dark:text-${passwordStrength.color}-400`}>
            {passwordStrength.label}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${bgColorMap[passwordStrength.color]} transition-all duration-300`}
            style={{ width: widthMap[passwordStrength.score] }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 dark:from-blue-900 dark:via-blue-800 dark:to-cyan-900 px-4 py-8">
      <Card className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl mb-4">
            <Library className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Daftar Akun Baru
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Buat akun untuk mengakses perpustakaan online
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <Input
            label="Nama Lengkap"
            type="text"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            icon={<User className="w-5 h-5" />}
            placeholder="Masukkan nama lengkap"
            required
          />

          {/* Email */}
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            icon={<Mail className="w-5 h-5" />}
            placeholder="nama@email.com"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Password */}
            <div>
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                icon={<Lock className="w-5 h-5" />}
                placeholder="Minimal 6 karakter"
                required
              />
              {getPasswordStrengthIndicator()}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Input
                label="Konfirmasi Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                icon={<Lock className="w-5 h-5" />}
                placeholder="Ulangi password"
                required
              />
              {formData.confirmPassword && (
                <div className="absolute right-3 top-11">
                  {formData.password === formData.confirmPassword ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Phone */}
          <Input
            label="Nomor Telepon"
            type="tel"
            name="telepon"
            value={formData.telepon}
            onChange={handleChange}
            icon={<Phone className="w-5 h-5" />}
            placeholder="08xxxxxxxxxx atau 62xxx"
            required
          />

          {/* Address */}
          <Textarea
            label="Alamat"
            name="alamat"
            value={formData.alamat}
            onChange={handleChange}
            placeholder="Masukkan alamat lengkap"
            rows={3}
            required
          />

          {/* Submit Button */}
          <Button type="submit" fullWidth loading={loading}>
            Daftar Sekarang
          </Button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              Masuk di sini
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            ← Kembali ke Beranda
          </Link>
        </div>
      </Card>
    </div>
  );
}
