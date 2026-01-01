'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Badge from '@/components/ui/Badge';
import { Plus, Edit, Trash2, FolderOpen, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  // Edit mode
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    namaKategori: '',
    color: '#3B82F6',
  });

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Add form data
  const [addFormData, setAddFormData] = useState({
    namaKategori: '',
    color: '#3B82F6',
  });

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

      // Fetch categories and books
      const [categoriesRes, booksRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/books'),
      ]);

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData.categories);
      }

      if (booksRes.ok) {
        const booksData = await booksRes.json();
        setBooks(booksData.books);
      }
    } catch (error) {
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  // Count books per category
  const getBookCount = (categoryId) => {
    return books.filter((book) => book.kategoriId === categoryId).length;
  };

  // Handle add category
  const handleAddCategory = async () => {
    if (!addFormData.namaKategori.trim()) {
      toast.error('Nama kategori harus diisi');
      return;
    }

    setSaving(true);

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addFormData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Gagal menambah kategori');
        return;
      }

      toast.success('Kategori berhasil ditambahkan!');
      setShowAddModal(false);
      setAddFormData({ namaKategori: '', color: '#3B82F6' });
      fetchData(); // Refresh data
    } catch (error) {
      toast.error('Terjadi kesalahan');
    } finally {
      setSaving(false);
    }
  };

  // Start editing
  const startEdit = (category) => {
    setEditingId(category.id);
    setEditFormData({
      namaKategori: category.namaKategori,
      color: category.color,
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditFormData({ namaKategori: '', color: '#3B82F6' });
  };

  // Handle edit category
  const handleEditCategory = async (categoryId) => {
    if (!editFormData.namaKategori.trim()) {
      toast.error('Nama kategori harus diisi');
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Gagal memperbarui kategori');
        return;
      }

      toast.success('Kategori berhasil diperbarui!');
      setEditingId(null);
      fetchData(); // Refresh data
    } catch (error) {
      toast.error('Terjadi kesalahan');
    } finally {
      setSaving(false);
    }
  };

  // Handle delete category
  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    setDeleting(selectedCategory.id);

    try {
      const res = await fetch(`/api/categories/${selectedCategory.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Gagal menghapus kategori');
        return;
      }

      toast.success('Kategori berhasil dihapus!');
      setShowDeleteModal(false);
      setSelectedCategory(null);
      fetchData(); // Refresh data
    } catch (error) {
      toast.error('Terjadi kesalahan');
    } finally {
      setDeleting(null);
    }
  };

  // Open delete modal
  const openDeleteModal = (category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  // Predefined colors
  const colorOptions = [
    { value: '#3B82F6', label: 'Biru', color: 'bg-blue-500' },
    { value: '#10B981', label: 'Hijau', color: 'bg-green-500' },
    { value: '#EF4444', label: 'Merah', color: 'bg-red-500' },
    { value: '#F59E0B', label: 'Kuning', color: 'bg-yellow-500' },
    { value: '#8B5CF6', label: 'Ungu', color: 'bg-purple-500' },
    { value: '#EC4899', label: 'Pink', color: 'bg-pink-500' },
    { value: '#06B6D4', label: 'Cyan', color: 'bg-cyan-500' },
    { value: '#F97316', label: 'Oranye', color: 'bg-orange-500' },
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
              Kelola Kategori
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Tambah, edit, dan hapus kategori buku
            </p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Tambah Kategori
          </Button>
        </div>

        {/* Categories Table */}
        <Card>
          {categories.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Nama Kategori
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Warna
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Jumlah Buku
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                  {categories.map((category) => {
                    const isEditing = editingId === category.id;
                    const bookCount = getBookCount(category.id);

                    return (
                      <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <td className="px-4 py-4">
                          {isEditing ? (
                            <Input
                              value={editFormData.namaKategori}
                              onChange={(e) =>
                                setEditFormData((prev) => ({
                                  ...prev,
                                  namaKategori: e.target.value,
                                }))
                              }
                              placeholder="Nama kategori"
                              className="max-w-xs"
                            />
                          ) : (
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {category.namaKategori}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          {isEditing ? (
                            <div className="flex gap-2">
                              {colorOptions.map((color) => (
                                <button
                                  key={color.value}
                                  type="button"
                                  onClick={() =>
                                    setEditFormData((prev) => ({
                                      ...prev,
                                      color: color.value,
                                    }))
                                  }
                                  className={`w-8 h-8 rounded-full ${color.color} ${
                                    editFormData.color === color.value
                                      ? 'ring-2 ring-offset-2 ring-gray-400'
                                      : ''
                                  }`}
                                  title={color.label}
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div
                                className="w-6 h-6 rounded-full"
                                style={{ backgroundColor: category.color }}
                              />
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant={bookCount > 0 ? 'primary' : 'default'}>
                            {bookCount} Buku
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            {isEditing ? (
                              <>
                                <Button
                                  variant="success"
                                  size="sm"
                                  onClick={() => handleEditCategory(category.id)}
                                  loading={saving}
                                  disabled={saving}
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={cancelEdit}
                                  disabled={saving}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => startEdit(category)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => openDeleteModal(category)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            )}
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
              <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Belum ada kategori
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Add Category Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Tambah Kategori Baru"
      >
        <div className="space-y-4">
          <Input
            label="Nama Kategori"
            value={addFormData.namaKategori}
            onChange={(e) =>
              setAddFormData((prev) => ({
                ...prev,
                namaKategori: e.target.value,
              }))
            }
            placeholder="Masukkan nama kategori"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Warna
            </label>
            <div className="flex gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() =>
                    setAddFormData((prev) => ({
                      ...prev,
                      color: color.value,
                    }))
                  }
                  className={`w-10 h-10 rounded-full ${color.color} ${
                    addFormData.color === color.value
                      ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-600'
                      : ''
                  }`}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="ghost"
              onClick={() => setShowAddModal(false)}
              disabled={saving}
            >
              Batal
            </Button>
            <Button onClick={handleAddCategory} loading={saving}>
              Tambah Kategori
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedCategory(null);
        }}
        title="Hapus Kategori"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Apakah Anda yakin ingin menghapus kategori ini?
          </p>
          {selectedCategory && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full"
                  style={{ backgroundColor: selectedCategory.color }}
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {selectedCategory.namaKategori}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {getBookCount(selectedCategory.id)} Buku
                  </p>
                </div>
              </div>
            </div>
          )}
          {selectedCategory && getBookCount(selectedCategory.id) > 0 && (
            <p className="text-sm text-red-600 dark:text-red-400">
              Peringatan: Kategori ini memiliki {getBookCount(selectedCategory.id)} buku.
              Pastikan untuk memindahkan buku ke kategori lain terlebih dahulu.
            </p>
          )}
          <div className="flex gap-3 justify-end">
            <Button
              variant="ghost"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedCategory(null);
              }}
              disabled={deleting !== null}
            >
              Batal
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteCategory}
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
