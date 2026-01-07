'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MemberLayout from '@/components/layout/MemberLayout';
import StatsCard from '@/components/features/StatsCard';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { BookCopy, Clock, AlertCircle, CheckCircle, Calendar } from 'lucide-react';
import { BUSINESS_RULES } from '@/lib/constants';
import { formatDate, formatCurrency, getDaysRemaining, isOverdue } from '@/lib/utils';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function MemberDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [extending, setExtending] = useState(null);

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

  // Calculate stats
  const activeLoans = loans.filter((loan) => loan.status === 'approved');
  const pendingLoans = loans.filter((loan) => loan.status === 'pending');
  const overdueLoans = activeLoans.filter((loan) =>
    loan.tanggalHarusKembali && isOverdue(loan.tanggalHarusKembali)
  );
  const quota = BUSINESS_RULES.MAX_ACTIVE_LOANS - activeLoans.length;
  const totalFines = loans.reduce((sum, loan) => sum + (loan.denda || 0), 0);

  // Handle extend loan
  const handleExtendLoan = async (loan) => {
    if (!loan.id) return;

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
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Selamat Datang, {user?.nama}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Berikut adalah ringkasan peminjaman buku Anda
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Peminjaman Aktif"
            value={activeLoans.length}
            icon={BookCopy}
            color="blue"
          />
          <StatsCard
            title="Kuota Tersisa"
            value={quota}
            icon={CheckCircle}
            color="green"
          />
          <StatsCard
            title="Terlambat"
            value={overdueLoans.length}
            icon={AlertCircle}
            color="red"
          />
          <StatsCard
            title="Menunggu Persetujuan"
            value={pendingLoans.length}
            icon={Clock}
            color="yellow"
          />
        </div>

        {/* Total Fines */}
        {totalFines > 0 && (
          <Card className="border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Total Denda
                </p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(totalFines)}
                </p>
              </div>
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
          </Card>
        )}

        {/* Active Loans */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Peminjaman Aktif
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/member/history')}
            >
              Lihat Semua
            </Button>
          </div>

          {activeLoans.length > 0 ? (
            <div className="space-y-4">
              {activeLoans.map((loan) => {
                const daysRemaining = loan.tanggalHarusKembali
                  ? getDaysRemaining(loan.tanggalHarusKembali)
                  : null;
                const isLateReturn = daysRemaining !== null && daysRemaining < 0;
                const canExtend = !loan.diperpanjang && daysRemaining !== null && daysRemaining >= 0;

                return (
                  <Card key={loan.id} hover className="bg-gray-50 dark:bg-gray-800">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Book Cover */}
                      <div className="relative w-full md:w-24 h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                        {loan.book?.coverUrl ? (
                          <Image
                            src={loan.book.coverUrl}
                            alt={loan.book.judul}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookCopy className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Book Info */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          {loan.book?.judul}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {loan.book?.pengarang}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>Pinjam: {formatDate(loan.tanggalPinjam)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>Kembali: {formatDate(loan.tanggalHarusKembali)}</span>
                          </div>
                        </div>

                        {/* Countdown */}
                        {daysRemaining !== null && (
                          <div className={cn(
                            'flex items-center gap-2 mt-3 text-sm font-medium',
                            isLateReturn
                              ? 'text-red-600 dark:text-red-400'
                              : daysRemaining <= 2
                              ? 'text-yellow-600 dark:text-yellow-400'
                              : 'text-green-600 dark:text-green-400'
                          )}>
                            <Clock className="w-4 h-4" />
                            {isLateReturn ? (
                              <span>Terlambat {Math.abs(daysRemaining)} hari</span>
                            ) : (
                              <span>{daysRemaining} hari lagi</span>
                            )}
                          </div>
                        )}

                        {loan.diperpanjang && (
                          <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                            Sudah diperpanjang
                          </p>
                        )}

                        {loan.denda > 0 && (
                          <p className="text-sm text-red-600 dark:text-red-400 mt-2 font-medium">
                            Denda: {formatCurrency(loan.denda)}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex md:flex-col gap-2">
                        {canExtend && (
                          <Button
                            variant="warning"
                            size="sm"
                            onClick={() => handleExtendLoan(loan)}
                            loading={extending === loan.id}
                            disabled={extending !== null}
                          >
                            Perpanjang
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookCopy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Anda belum memiliki peminjaman aktif
              </p>
              <Button onClick={() => router.push('/catalog')}>
                Jelajahi Katalog
              </Button>
            </div>
          )}
        </Card>

        {/* Pending Loans */}
        {pendingLoans.length > 0 && (
          <Card>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Menunggu Persetujuan
            </h2>
            <div className="space-y-3">
              {pendingLoans.map((loan) => (
                <div
                  key={loan.id}
                  className="flex items-center gap-4 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg"
                >
                  <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {loan.book?.judul}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Diajukan pada {formatDate(loan.tanggalPinjam)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </MemberLayout>
  );
}
