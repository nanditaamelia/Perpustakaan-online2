'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Search, Users, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { formatDate, filterBySearch } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminMembersPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [members, setMembers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

      // Fetch users and loans
      const [usersRes, loansRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/loans'),
      ]);

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        // Filter only members
        const membersList = usersData.users.filter((u) => u.role === 'member');
        setMembers(membersList);
      }

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

  // Get active loans count for a member
  const getActiveLoanCount = (userId) => {
    return loans.filter(
      (loan) => loan.userId === userId && loan.status === 'approved'
    ).length;
  };

  // Filter members
  const getFilteredMembers = () => {
    if (!searchTerm) return members;
    return filterBySearch(members, searchTerm, ['nama', 'email', 'noAnggota', 'telepon']);
  };

  const filteredMembers = getFilteredMembers();

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
            Kelola Member
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Lihat daftar member terdaftar
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Member</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {members.length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <Input
            placeholder="Cari nama, email, nomor anggota, atau telepon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-5 h-5" />}
          />
        </Card>

        {/* Members Table */}
        <Card>
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Menampilkan {filteredMembers.length} dari {members.length} member
            </p>
          </div>

          {filteredMembers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Kontak
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Alamat
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Tgl Daftar
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Peminjaman Aktif
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                  {filteredMembers.map((member) => {
                    const activeLoanCount = getActiveLoanCount(member.id);

                    return (
                      <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <td className="px-4 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {member.nama}
                            </p>
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                              {member.noAnggota}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Mail className="w-4 h-4" />
                              <span className="truncate max-w-xs">{member.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Phone className="w-4 h-4" />
                              <span>{member.telepon}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">{member.alamat}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(member.createdAt)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <Badge
                            variant={activeLoanCount > 0 ? 'primary' : 'default'}
                          >
                            {activeLoanCount} Buku
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Tidak ada member ditemukan
              </p>
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}
