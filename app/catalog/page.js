'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BookCard from '@/components/features/BookCard';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Search, Filter, ChevronLeft, ChevronRight, BookOpen, User, Calendar, FileText } from 'lucide-react';
import { PAGINATION, SORT_OPTIONS, SORT_OPTIONS_LABELS } from '@/lib/constants';
import { filterBySearch, sortBy, paginate } from '@/lib/utils';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function CatalogPage() {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);

  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOption, setSortOption] = useState(SORT_OPTIONS.NEWEST);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [selectedBook, setSelectedBook] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Fetch books and categories
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [booksRes, categoriesRes] = await Promise.all([
        fetch('/api/books'),
        fetch('/api/categories'),
      ]);

      const booksData = await booksRes.json();
      const categoriesData = await categoriesRes.json();

      if (booksRes.ok) {
        setBooks(booksData.books);
      }

      if (categoriesRes.ok) {
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
      filtered = filterBySearch(filtered, searchTerm, ['judul', 'pengarang', 'penerbit']);
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((book) => book.kategoriId === selectedCategory);
    }

    // Sort
    switch (sortOption) {
      case SORT_OPTIONS.NEWEST:
        filtered = sortBy(filtered, 'createdAt', 'desc');
        break;
      case SORT_OPTIONS.OLDEST:
        filtered = sortBy(filtered, 'createdAt', 'asc');
        break;
      case SORT_OPTIONS.TITLE_ASC:
        filtered = sortBy(filtered, 'judul', 'asc');
        break;
      case SORT_OPTIONS.TITLE_DESC:
        filtered = sortBy(filtered, 'judul', 'desc');
        break;
      case SORT_OPTIONS.AUTHOR_ASC:
        filtered = sortBy(filtered, 'pengarang', 'asc');
        break;
      case SORT_OPTIONS.AUTHOR_DESC:
        filtered = sortBy(filtered, 'pengarang', 'desc');
        break;
      default:
        break;
    }

    return filtered;
  };

  // Paginate books
  const getPaginatedBooks = () => {
    const filtered = getFilteredBooks();
    return paginate(filtered, currentPage, PAGINATION.BOOKS_PER_PAGE);
  };

  const paginatedData = getPaginatedBooks();

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortOption]);

  // Handle view book detail
  const handleViewBook = (book) => {
    setSelectedBook(book);
    setShowDetailModal(true);
  };

  // Handle borrow book
  const handleBorrowBook = async (book) => {
    setBorrowing(true);

    try {
      const res = await fetch('/api/loans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: book.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          toast.error('Silakan login terlebih dahulu');
          router.push('/login');
          return;
        }
        toast.error(data.error || 'Gagal meminjam buku');
        return;
      }

      toast.success('Peminjaman berhasil diajukan! Menunggu persetujuan admin.');
      setShowDetailModal(false);
      fetchData(); // Refresh books to update stock
    } catch (error) {
      toast.error('Terjadi kesalahan');
    } finally {
      setBorrowing(false);
    }
  };

  // Category options for filter
  const categoryOptions = [
    { value: '', label: 'Semua Kategori' },
    ...categories.map((cat) => ({
      value: cat.id,
      label: cat.namaKategori,
    })),
  ];

  // Sort options
  const sortOptions = Object.keys(SORT_OPTIONS).map((key) => ({
    value: SORT_OPTIONS[key],
    label: SORT_OPTIONS_LABELS[SORT_OPTIONS[key]],
  }));

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Katalog Buku
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Jelajahi koleksi buku perpustakaan kami
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Search */}
              <div className="md:col-span-5">
                <Input
                  placeholder="Cari judul, pengarang, atau penerbit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search className="w-5 h-5" />}
                />
              </div>

              {/* Category Filter */}
              <div className="md:col-span-4">
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  options={categoryOptions}
                  icon={<Filter className="w-5 h-5" />}
                />
              </div>

              {/* Sort */}
              <div className="md:col-span-3">
                <Select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  options={sortOptions}
                />
              </div>
            </div>
          </div>

          {/* Results Info */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Menampilkan {paginatedData.items.length} dari {paginatedData.totalItems} buku
            </p>
          </div>

          {/* Books Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : paginatedData.items.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {paginatedData.items.map((book) => {
                  const category = categories.find((cat) => cat.id === book.kategoriId);
                  return (
                    <BookCard
                      key={book.id}
                      book={book}
                      kategori={category}
                      onView={handleViewBook}
                      onBorrow={handleBorrowBook}
                    />
                  );
                })}
              </div>

              {/* Pagination */}
              {paginatedData.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={!paginatedData.hasPrev}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Sebelumnya
                  </Button>

                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Halaman {paginatedData.currentPage} dari {paginatedData.totalPages}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={!paginatedData.hasNext}
                  >
                    Selanjutnya
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Tidak ada buku ditemukan
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Book Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Detail Buku"
        size="lg"
      >
        {selectedBook && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Book Cover */}
              <div className="relative w-full md:w-48 h-72 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                {selectedBook.coverUrl ? (
                  <Image
                    src={selectedBook.coverUrl}
                    alt={selectedBook.judul}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 192px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-20 h-20 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Book Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  {selectedBook.judul}
                </h2>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <User className="w-5 h-5" />
                    <span><strong>Pengarang:</strong> {selectedBook.pengarang}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <BookOpen className="w-5 h-5" />
                    <span><strong>Penerbit:</strong> {selectedBook.penerbit}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="w-5 h-5" />
                    <span><strong>Tahun Terbit:</strong> {selectedBook.tahunTerbit}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <FileText className="w-5 h-5" />
                    <span><strong>ISBN:</strong> {selectedBook.isbn}</span>
                  </div>

                  <div className="pt-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Ketersediaan:
                    </p>
                    <p className={`text-lg font-bold ${selectedBook.stokTersedia > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {selectedBook.stokTersedia} / {selectedBook.stokTotal} Tersedia
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Synopsis */}
            {selectedBook.sinopsis && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Sinopsis
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {selectedBook.sinopsis}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowDetailModal(false)}
              >
                Tutup
              </Button>
              {selectedBook.stokTersedia > 0 && (
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => handleBorrowBook(selectedBook)}
                  loading={borrowing}
                >
                  Pinjam Buku
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
