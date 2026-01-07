'use client';

import Image from 'next/image';
import { formatDate, formatCurrency, getDaysRemaining } from '@/lib/utils';
import { StatusBadge } from '../ui/Badge';
import Button from '../ui/Button';
import { BookOpen, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Loan Table component for displaying loan records
 */
export default function LoanTable({
  loans,
  role = 'member',
  onApprove,
  onReject,
  onReturn,
  onExtend,
}) {
  if (!loans || loans.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          Tidak ada data peminjaman
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <tr>
            {role === 'admin' && (
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Member
              </th>
            )}
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Buku
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Tgl Pinjam
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Deadline
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Denda
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
          {loans.map((loan) => {
            const daysRemaining = loan.tanggalHarusKembali
              ? getDaysRemaining(loan.tanggalHarusKembali)
              : null;
            const isOverdue = daysRemaining !== null && daysRemaining < 0;
            const canExtend =
              loan.status === 'approved' &&
              !loan.diperpanjang &&
              daysRemaining !== null &&
              daysRemaining >= 0;

            return (
              <tr key={loan.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                {role === 'admin' && loan.user && (
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {loan.user.nama}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {loan.user.noAnggota}
                      </p>
                    </div>
                  </td>
                )}

                <td className="px-4 py-4">
                  {loan.book ? (
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-14 rounded overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                        {loan.book.coverUrl ? (
                          <Image
                            src={loan.book.coverUrl}
                            alt={loan.book.judul}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {loan.book.judul}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {loan.book.pengarang}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">-</span>
                  )}
                </td>

                <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                  {formatDate(loan.tanggalPinjam)}
                </td>

                <td className="px-4 py-4">
                  {loan.tanggalHarusKembali ? (
                    <div>
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        {formatDate(loan.tanggalHarusKembali)}
                      </p>
                      {loan.status === 'approved' && daysRemaining !== null && (
                        <div className={cn(
                          'flex items-center gap-1 text-xs mt-1',
                          isOverdue
                            ? 'text-red-600 dark:text-red-400'
                            : daysRemaining <= 2
                            ? 'text-yellow-600 dark:text-yellow-400'
                            : 'text-gray-500 dark:text-gray-400'
                        )}>
                          <Clock className="w-3 h-3" />
                          {isOverdue
                            ? `Terlambat ${Math.abs(daysRemaining)} hari`
                            : `${daysRemaining} hari lagi`}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">-</span>
                  )}
                </td>

                <td className="px-4 py-4">
                  <StatusBadge status={loan.status} />
                  {loan.diperpanjang && (
                    <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      Diperpanjang
                    </div>
                  )}
                </td>

                <td className="px-4 py-4">
                  {loan.denda > 0 ? (
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">
                      {formatCurrency(loan.denda)}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500">-</span>
                  )}
                </td>

                <td className="px-4 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {/* Admin actions */}
                    {role === 'admin' && loan.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => onApprove?.(loan)}
                        >
                          Setujui
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => onReject?.(loan)}
                        >
                          Tolak
                        </Button>
                      </>
                    )}
                    {role === 'admin' && loan.status === 'approved' && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => onReturn?.(loan)}
                      >
                        Kembalikan
                      </Button>
                    )}

                    {/* Member actions */}
                    {role === 'member' && canExtend && (
                      <Button
                        size="sm"
                        variant="warning"
                        onClick={() => onExtend?.(loan)}
                      >
                        Perpanjang
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
