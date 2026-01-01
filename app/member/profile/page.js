'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MemberLayout from '@/components/layout/MemberLayout';
import Card from '@/components/ui/Card';
import Input, { Textarea } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { User, Mail, Phone, MapPin, Lock, CheckCircle2 } from 'lucide-react';
import { PATTERNS } from '@/lib/constants';
import toast from 'react-hot-toast';

export default function MemberProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Profile form data
  const [profileData, setProfileData] = useState({
    nama: '',
    telepon: '',
    alamat: '',
  });

  // Password form data
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      const res = await fetch('/api/auth/session');
      if (!res.ok) {
        router.push('/login');
        return;
      }

      const data = await res.json();
      setUser(data.user);
      setProfileData({
        nama: data.user.nama || '',
        telepon: data.user.telepon || '',
        alamat: data.user.alamat || '',
      });
    } catch (error) {
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateProfile = () => {
    if (!profileData.nama.trim()) {
      toast.error('Nama harus diisi');
      return false;
    }

    if (!profileData.telepon.trim()) {
      toast.error('Nomor telepon harus diisi');
      return false;
    }

    if (!PATTERNS.PHONE.test(profileData.telepon)) {
      toast.error('Format nomor telepon tidak valid');
      return false;
    }

    if (!profileData.alamat.trim()) {
      toast.error('Alamat harus diisi');
      return false;
    }

    return true;
  };

  const validatePassword = () => {
    if (!passwordData.currentPassword) {
      toast.error('Password lama harus diisi');
      return false;
    }

    if (!passwordData.newPassword) {
      toast.error('Password baru harus diisi');
      return false;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password baru minimal 6 karakter');
      return false;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Konfirmasi password tidak cocok');
      return false;
    }

    return true;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!validateProfile()) {
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Gagal memperbarui profil');
        return;
      }

      toast.success('Profil berhasil diperbarui!');
      fetchUserData(); // Refresh user data
    } catch (error) {
      toast.error('Terjadi kesalahan');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    setChangingPassword(true);

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Gagal mengubah password');
        return;
      }

      toast.success('Password berhasil diubah!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error('Terjadi kesalahan');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <MemberLayout user={user}>
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </MemberLayout>
    );
  }

  return (
    <MemberLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Profil Saya
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Kelola informasi profil dan keamanan akun Anda
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Info Card */}
          <Card>
            <div className="text-center">
              <div className="inline-flex p-6 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full mb-4">
                <User className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {user?.nama}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {user?.email}
              </p>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {user?.noAnggota}
              </p>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Role:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {user?.role === 'member' ? 'Member' : 'Admin'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Bergabung:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {new Date(user?.createdAt).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Edit Profile & Change Password */}
          <div className="lg:col-span-2 space-y-6">
            {/* Edit Profile Form */}
            <Card>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Edit Profil
              </h2>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <Input
                  label="Nama Lengkap"
                  type="text"
                  name="nama"
                  value={profileData.nama}
                  onChange={handleProfileChange}
                  icon={<User className="w-5 h-5" />}
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  value={user?.email}
                  icon={<Mail className="w-5 h-5" />}
                  disabled
                  helperText="Email tidak dapat diubah"
                />

                <Input
                  label="Nomor Telepon"
                  type="tel"
                  name="telepon"
                  value={profileData.telepon}
                  onChange={handleProfileChange}
                  icon={<Phone className="w-5 h-5" />}
                  placeholder="08xxxxxxxxxx atau 62xxx"
                  required
                />

                <Textarea
                  label="Alamat"
                  name="alamat"
                  value={profileData.alamat}
                  onChange={handleProfileChange}
                  placeholder="Masukkan alamat lengkap"
                  rows={3}
                  required
                />

                <div className="flex justify-end">
                  <Button type="submit" loading={saving}>
                    Simpan Perubahan
                  </Button>
                </div>
              </form>
            </Card>

            {/* Change Password Form */}
            <Card>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Ubah Password
              </h2>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <Input
                  label="Password Lama"
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  icon={<Lock className="w-5 h-5" />}
                  placeholder="Masukkan password lama"
                  required
                />

                <Input
                  label="Password Baru"
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  icon={<Lock className="w-5 h-5" />}
                  placeholder="Minimal 6 karakter"
                  required
                />

                <div className="relative">
                  <Input
                    label="Konfirmasi Password Baru"
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    icon={<Lock className="w-5 h-5" />}
                    placeholder="Ulangi password baru"
                    required
                  />
                  {passwordData.confirmPassword && passwordData.newPassword === passwordData.confirmPassword && (
                    <div className="absolute right-3 top-11">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button type="submit" variant="warning" loading={changingPassword}>
                    Ubah Password
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </MemberLayout>
  );
}
