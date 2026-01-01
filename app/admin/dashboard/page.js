'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';
import StatsCard from '@/components/features/StatsCard';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { StatusBadge } from '@/components/ui/Badge';
import { BookOpen, Users, BookCopy, Clock, AlertCircle, Banknote } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentLoans, setRecentLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch user session
      const sessionRes = await fetch('/api/auth/session');
      if (!sessionRes.ok) {
        router.push('/login');
        return;
      }
      const sessionData = await sessionRes.json();

      if (sessionData.user.role !== 'admin') {
        router.push('/');
        return;
      }

      setUser(sessionData.user);

      // Fetch statistics
      const statsRes = await fetch('/api/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }

      // Fetch recent loans
      const loansRes = await fetch('/api/loans');
      if (loansRes.ok) {
        const loansData = await loansRes.json();
        // Get 10 most recent loans
        const sorted = [...loansData.loans].sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setRecentLoans(sorted.slice(0, 10));
      }
    } catch (error) {
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout user={user}>
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Dashboard Admin
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ringkasan dan statistik perpustakaan
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCard
            title="Total Buku"
            value={stats?.totalBooks || 0}
            icon={BookOpen}
            color="blue"
          />
          <StatsCard
            title="Buku Tersedia"
            value={stats?.availableBooks || 0}
            icon={BookOpen}
            color="green"
          />
          <StatsCard
            title="Total Member"
            value={stats?.totalMembers || 0}
            icon={Users}
            color="purple"
          />
          <StatsCard
            title="Peminjaman Aktif"
            value={stats?.activeLoans || 0}
            icon={BookCopy}
            color="cyan"
          />
          <StatsCard
            title="Menunggu Persetujuan"
            value={stats?.pendingLoans || 0}
            icon={Clock}
            color="yellow"
          />
          <StatsCard
            title="Denda Bulan Ini"
            value={formatCurrency(stats?.totalDendaThisMonth || 0)}
            icon={Banknote}
            color="red"
          />
        </div>

        {/* Recent Activities */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Aktivitas Terbaru
            </h2>
          </div>

          {recentLoans.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Buku
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                  {recentLoans.map((loan) => (
                    <tr key={loan.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="px-4 py-4">
                        {loan.user ? (
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {loan.user.nama}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {loan.user.noAnggota}
                            </p>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {loan.book ? (
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {loan.book.judul}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {loan.book.pengarang}
                            </p>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {formatDate(loan.createdAt)}
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={loan.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <BookCopy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Belum ada aktivitas peminjaman
              </p>
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            hover
            className="cursor-pointer"
            onClick={() => router.push('/admin/books')}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  Kelola Buku
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tambah, edit, atau hapus buku
                </p>
              </div>
            </div>
          </Card>

          <Card
            hover
            className="cursor-pointer"
            onClick={() => router.push('/admin/loans')}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  Persetujuan Peminjaman
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stats?.pendingLoans || 0} menunggu persetujuan
                </p>
              </div>
            </div>
          </Card>

          <Card
            hover
            className="cursor-pointer"
            onClick={() => router.push('/admin/members')}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  Kelola Member
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Lihat daftar member terdaftar
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
