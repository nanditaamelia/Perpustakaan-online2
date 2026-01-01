'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';
import LoanTable from '@/components/features/LoanTable';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminLoansPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');

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

      // Fetch loans
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

  // Handle approve loan
  const handleApproveLoan = async (loan) => {
    setProcessing(loan.id);

    try {
      const res = await fetch('/api/loans/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loanId: loan.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Gagal menyetujui peminjaman');
        return;
      }

      toast.success('Peminjaman berhasil disetujui!');
      fetchData(); // Refresh data
    } catch (error) {
      toast.error('Terjadi kesalahan');
    } finally {
      setProcessing(null);
    }
  };

  // Handle reject loan
  const handleRejectLoan = async (loan) => {
    setProcessing(loan.id);

    try {
      const res = await fetch('/api/loans/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loanId: loan.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Gagal menolak peminjaman');
        return;
      }

      toast.success('Peminjaman berhasil ditolak!');
      fetchData(); // Refresh data
    } catch (error) {
      toast.error('Terjadi kesalahan');
    } finally {
      setProcessing(null);
    }
  };

  // Handle return loan
  const handleReturnLoan = async (loan) => {
    setProcessing(loan.id);

    try {
      const res = await fetch('/api/loans/return', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loanId: loan.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Gagal mengembalikan buku');
        return;
      }

      toast.success(
        data.denda > 0
          ? `Buku berhasil dikembalikan! Denda: ${new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
            }).format(data.denda)}`
          : 'Buku berhasil dikembalikan!'
      );
      fetchData(); // Refresh data
    } catch (error) {
      toast.error('Terjadi kesalahan');
    } finally {
      setProcessing(null);
    }
  };

  // Filter loans by status
  const getFilteredLoans = () => {
    return loans.filter((loan) => {
      if (activeTab === 'all') return true;
      return loan.status === activeTab;
    });
  };

  const filteredLoans = getFilteredLoans();

  // Stats
  const stats = {
    all: loans.length,
    pending: loans.filter((l) => l.status === 'pending').length,
    approved: loans.filter((l) => l.status === 'approved').length,
    returned: loans.filter((l) => l.status === 'returned').length,
    rejected: loans.filter((l) => l.status === 'rejected').length,
  };

  // Tabs
  const tabs = [
    { id: 'pending', label: 'Menunggu Persetujuan', count: stats.pending },
    { id: 'approved', label: 'Disetujui / Aktif', count: stats.approved },
    { id: 'returned', label: 'Dikembalikan', count: stats.returned },
    { id: 'rejected', label: 'Ditolak', count: stats.rejected },
    { id: 'all', label: 'Semua', count: stats.all },
  ];

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
            Kelola Peminjaman
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Kelola persetujuan dan pengembalian buku
          </p>
        </div>

        {/* Tabs */}
        <Card>
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  )}
                >
                  {tab.label}
                  <span
                    className={cn(
                      'ml-2 py-0.5 px-2.5 rounded-full text-xs',
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    )}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </Card>

        {/* Loans Table */}
        <Card>
          <LoanTable
            loans={filteredLoans}
            role="admin"
            onApprove={handleApproveLoan}
            onReject={handleRejectLoan}
            onReturn={handleReturnLoan}
          />
        </Card>
      </div>
    </AdminLayout>
  );
}
