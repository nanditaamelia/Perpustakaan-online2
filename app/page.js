'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Users, Clock, ArrowRight, Library, Star, TrendingUp, Calendar, User as UserIcon } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BookCard from '@/components/features/BookCard';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Modal from '@/components/ui/Modal';
import Badge, { StockBadge } from '@/components/ui/Badge';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function HomePage() {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [borrowing, setBorrowing] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch('/api/books');
      const data = await res.json();
      setBooks(data.books.slice(0, 6)); // Show only 6 latest books
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewBook = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBook(null);
  };

  const handleBorrowBook = async (book) => {
    setBorrowing(true);
    try {
      // Check if user is logged in
      const sessionRes = await fetch('/api/auth/session');
      if (!sessionRes.ok) {
        toast.error('Silakan login terlebih dahulu');
        router.push('/login');
        return;
      }

      const { user } = await sessionRes.json();

      if (user.role !== 'member') {
        toast.error('Hanya member yang dapat meminjam buku');
        return;
      }

      // Create loan request
      const res = await fetch('/api/loans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: book.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Gagal membuat peminjaman');
        return;
      }

      toast.success('Peminjaman berhasil diajukan! Menunggu persetujuan admin.');
      handleCloseModal();

      // Redirect to member dashboard
      setTimeout(() => {
        router.push('/member/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error borrowing book:', error);
      toast.error('Terjadi kesalahan');
    } finally {
      setBorrowing(false);
    }
  };

  const stats = [
    { icon: Library, label: 'Total Buku', value: '1000+', color: 'from-blue-500 to-blue-600' },
    { icon: Users, label: 'Member Aktif', value: '500+', color: 'from-green-500 to-green-600' },
    { icon: BookOpen, label: 'Buku Dipinjam', value: '200+', color: 'from-purple-500 to-purple-600' },
    { icon: TrendingUp, label: 'Rating', value: '4.8/5', color: 'from-yellow-500 to-yellow-600' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 dark:from-blue-900 dark:via-blue-800 dark:to-cyan-900 text-white py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Perpustakaan Online
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto animate-slide-up">
              Platform perpustakaan digital modern untuk kemudahan akses buku dan manajemen peminjaman
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link href="/catalog">
                <Button size="lg" variant="secondary">
                  Jelajahi Katalog
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="bg-white/10 border-white hover:bg-white/20 text-white hover:text-white">
                  Daftar Sekarang
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} gradient className="text-center">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-3`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Buku Terbaru
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Koleksi buku terbaru di perpustakaan kami
            </p>
          </div>

          {loading ? (
            <LoadingSpinner size="lg" text="Memuat buku..." />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {books.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    kategori={book.kategori}
                    onView={handleViewBook}
                    showActions={true}
                  />
                ))}
              </div>

              <div className="text-center">
                <Link href="/catalog">
                  <Button size="lg">
                    Lihat Semua Buku
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Kenapa Memilih Kami?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: 'Koleksi Lengkap',
                description: 'Ribuan buku dari berbagai kategori tersedia untuk Anda',
              },
              {
                icon: Clock,
                title: 'Proses Cepat',
                description: 'Peminjaman buku yang mudah dan cepat dengan sistem online',
              },
              {
                icon: Users,
                title: 'Komunitas Aktif',
                description: 'Bergabung dengan komunitas pembaca yang aktif dan antusias',
              },
            ].map((feature, index) => (
              <Card key={index} gradient className="text-center">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-900 dark:to-cyan-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Siap Memulai Petualangan Membaca?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Daftar sekarang dan nikmati akses ke ribuan buku berkualitas
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary">
              Daftar Gratis Sekarang
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Book Detail Modal */}
      {selectedBook && (
        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          title="Detail Buku"
          size="lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Book Cover */}
            <div className="md:col-span-1">
              <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                {selectedBook.coverUrl ? (
                  <Image
                    src={selectedBook.coverUrl}
                    alt={selectedBook.judul}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Stock Badge */}
              <div className="mt-4">
                <StockBadge
                  available={selectedBook.stokTersedia}
                  total={selectedBook.stokTotal}
                  size="md"
                />
              </div>
            </div>

            {/* Book Info */}
            <div className="md:col-span-2 space-y-4">
              {/* Title */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {selectedBook.judul}
                </h2>
                {selectedBook.kategori && (
                  <Badge
                    variant="primary"
                    size="md"
                    style={{
                      backgroundColor: selectedBook.kategori.color + '20',
                      color: selectedBook.kategori.color
                    }}
                  >
                    {selectedBook.kategori.namaKategori}
                  </Badge>
                )}
              </div>

              {/* Author */}
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <UserIcon className="w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Pengarang:</p>
                  <p className="font-medium">{selectedBook.pengarang}</p>
                </div>
              </div>

              {/* Publisher */}
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <BookOpen className="w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Penerbit:</p>
                  <p className="font-medium">{selectedBook.penerbit}</p>
                </div>
              </div>

              {/* Year */}
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Calendar className="w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tahun Terbit:</p>
                  <p className="font-medium">{selectedBook.tahunTerbit}</p>
                </div>
              </div>

              {/* ISBN */}
              <div className="text-gray-700 dark:text-gray-300">
                <p className="text-sm text-gray-500 dark:text-gray-400">ISBN:</p>
                <p className="font-medium font-mono text-sm">{selectedBook.isbn}</p>
              </div>

              {/* Synopsis */}
              {selectedBook.sinopsis && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Sinopsis
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {selectedBook.sinopsis}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 flex gap-3">
                <Button
                  variant="ghost"
                  onClick={handleCloseModal}
                  fullWidth
                >
                  Tutup
                </Button>
                {selectedBook.stokTersedia > 0 && (
                  <Button
                    variant="primary"
                    onClick={() => handleBorrowBook(selectedBook)}
                    loading={borrowing}
                    fullWidth
                  >
                    Pinjam Buku
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      <Footer />
    </div>
  );
}
