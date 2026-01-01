'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MemberLayout from '@/components/layout/MemberLayout';
import LoanTable from '@/components/features/LoanTable';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MemberHistoryPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [extending, setExtending] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

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
      setUser(sessionData.user);

      // Fetch user's loans
      const loansRes = await fetch('/api/loans');
      if (loansRes.ok) {
        const loansData = await loansRes.json();
        setLoans(loansData.loans);
      }
    } catch (error) {
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  // Handle extend loan
  const handleExtendLoan = async (loan) => {
    setExtending(loan.id);

    try {
      const res = await fetch('/api/loans/extend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loanId: loan.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Gagal memperpanjang peminjaman');
        return;
      }

      toast.success('Peminjaman berhasil diperpanjang!');
      fetchData(); // Refresh data
    } catch (error) {
      toast.error('Terjadi kesalahan');
    } finally {
      setExtending(null);
    }
  };

  // Filter loans by status
  const getFilteredLoans = () => {
    if (statusFilter === 'all') {
      return loans;
    }
    return loans.filter((loan) => loan.status === statusFilter);
  };

  const filteredLoans = getFilteredLoans();

  // Status options
  const statusOptions = [
    { value: 'all', label: 'Semua Status' },
    { value: 'pending', label: 'Menunggu Persetujuan' },
    { value: 'approved', label: 'Disetujui / Aktif' },
    { value: 'returned', label: 'Dikembalikan' },
    { value: 'rejected', label: 'Ditolak' },
  ];

  // Stats
  const stats = {
    all: loans.length,
    pending: loans.filter((l) => l.status === 'pending').length,
    approved: loans.filter((l) => l.status === 'approved').length,
    returned: loans.filter((l) => l.status === 'returned').length,
    rejected: loans.filter((l) => l.status === 'rejected').length,
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
            Riwayat Peminjaman
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Lihat semua riwayat peminjaman buku Anda
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {stats.all}
            </p>
          </Card>
          <Card className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Menunggu</p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {stats.pending}
            </p>
          </Card>
          <Card className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Aktif</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.approved}
            </p>
          </Card>
          <Card className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Dikembalikan</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.returned}
            </p>
          </Card>
          <Card className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ditolak</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {stats.rejected}
            </p>
          </Card>
        </div>

        {/* Filter */}
        <Card>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Daftar Peminjaman
            </h2>
            <div className="w-full sm:w-64">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={statusOptions}
                icon={<Filter className="w-5 h-5" />}
              />
            </div>
          </div>
        </Card>

        {/* Loans Table */}
        <Card>
          <LoanTable
            loans={filteredLoans}
            role="member"
            onExtend={handleExtendLoan}
          />
        </Card>
      </div>
    </MemberLayout>
  );
}
