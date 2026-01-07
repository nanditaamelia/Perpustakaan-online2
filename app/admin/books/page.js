'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';
import BookForm from '@/components/features/BookForm';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { StockBadge } from '@/components/ui/Badge';
import { Search, Plus, Edit, Trash2, BookOpen, Filter } from 'lucide-react';
import { filterBySearch, sortBy } from '@/lib/utils';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function AdminBooksPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

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

      // Fetch books and categories
      const [booksRes, categoriesRes] = await Promise.all([
        fetch('/api/books'),
        fetch('/api/categories'),
      ]);

      if (booksRes.ok) {
        const booksData = await booksRes.json();
        setBooks(booksData.books);
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData.categories);
      }
    } catch (error) {
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort books
  const getFilteredBooks = () => {
    let filtered = [...books];

    // Search filter
    if (searchTerm) {
      filtered = filterBySearch(filtered, searchTerm, ['judul', 'pengarang', 'penerbit', 'isbn']);
    }

    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter((book) => book.kategoriId === categoryFilter);
    }

    // Sort by title
    return sortBy(filtered, 'judul', 'asc');
  };

  const filteredBooks = getFilteredBooks();

  // Handle add book
  const handleAddBook = async (formData) => {
    setSaving(true);

    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Gagal menambah buku');
        return;
      }

      toast.success('Buku berhasil ditambahkan!');
      setShowAddModal(false);
      fetchData(); // Refresh data
    } catch (error) {
      toast.error('Terjadi kesalahan');
    } finally {
      setSaving(false);
    }
  };

  // Handle edit book
  const handleEditBook = async (formData) => {
    if (!selectedBook) return;

    setSaving(true);

    try {
      const res = await fetch(`/api/books/${selectedBook.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Gagal memperbarui buku');
        return;
      }

      toast.success('Buku berhasil diperbarui!');
      setShowEditModal(false);
      setSelectedBook(null);
      fetchData(); // Refresh data
    } catch (error) {
      toast.error('Terjadi kesalahan');
    } finally {
      setSaving(false);
    }
  };

  // Handle delete book
  const handleDeleteBook = async () => {
    if (!selectedBook) return;

    setDeleting(selectedBook.id);

    try {
      const res = await fetch(`/api/books/${selectedBook.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Gagal menghapus buku');
        return;
      }

      toast.success('Buku berhasil dihapus!');
      setShowDeleteModal(false);
      setSelectedBook(null);
      fetchData(); // Refresh data
    } catch (error) {
      toast.error('Terjadi kesalahan');
    } finally {
      setDeleting(null);
    }
  };

  // Open edit modal
  const openEditModal = (book) => {
    setSelectedBook(book);
    setShowEditModal(true);
  };

  // Open delete modal
  const openDeleteModal = (book) => {
    setSelectedBook(book);
    setShowDeleteModal(true);
  };

  // Category options for filter
  const categoryOptions = [
    { value: '', label: 'Semua Kategori' },
    ...categories.map((cat) => ({
      value: cat.id,
      label: cat.namaKategori,
    })),
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Kelola Buku
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Tambah, edit, dan hapus buku perpustakaan
            </p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Tambah Buku
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Cari judul, pengarang, penerbit, atau ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-5 h-5" />}
            />
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              options={categoryOptions}
              icon={<Filter className="w-5 h-5" />}
            />
          </div>
        </Card>

        {/* Books Table */}
        <Card>
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Menampilkan {filteredBooks.length} dari {books.length} buku
            </p>
          </div>

          {filteredBooks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Buku
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Penerbit
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Tahun
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Stok
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                  {filteredBooks.map((book) => {
                    const category = categories.find((cat) => cat.id === book.kategoriId);
                    return (
                      <tr key={book.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-16 rounded overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                              {book.coverUrl ? (
                                <Image
                                  src={book.coverUrl}
                                  alt={book.judul}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <BookOpen className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {book.judul}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {book.pengarang}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                ISBN: {book.isbn}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                          {category?.namaKategori || '-'}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                          {book.penerbit}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                          {book.tahunTerbit}
                        </td>
                        <td className="px-4 py-4">
                          <StockBadge
                            available={book.stokTersedia}
                            total={book.stokTotal}
                            size="sm"
                          />
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditModal(book)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => openDeleteModal(book)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Tidak ada buku ditemukan
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Add Book Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Tambah Buku Baru"
        size="lg"
      >
        <BookForm
          categories={categories}
          onSubmit={handleAddBook}
          onCancel={() => setShowAddModal(false)}
          loading={saving}
        />
      </Modal>

      {/* Edit Book Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedBook(null);
        }}
        title="Edit Buku"
        size="lg"
      >
        <BookForm
          book={selectedBook}
          categories={categories}
          onSubmit={handleEditBook}
          onCancel={() => {
            setShowEditModal(false);
            setSelectedBook(null);
          }}
          loading={saving}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedBook(null);
        }}
        title="Hapus Buku"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Apakah Anda yakin ingin menghapus buku ini?
          </p>
          {selectedBook && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {selectedBook.judul}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedBook.pengarang}
              </p>
            </div>
          )}
          <div className="flex gap-3 justify-end">
            <Button
              variant="ghost"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedBook(null);
              }}
              disabled={deleting !== null}
            >
              Batal
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteBook}
              loading={deleting !== null}
            >
              Hapus
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}
