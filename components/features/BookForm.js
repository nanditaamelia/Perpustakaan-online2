'use client';

import { useState, useEffect } from 'react';
import Input, { Textarea } from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { Upload, X } from 'lucide-react';

/**
 * Book Form component for add/edit book
 */
export default function BookForm({ book, categories, onSubmit, onCancel, loading = false }) {
  const [formData, setFormData] = useState({
    judul: '',
    pengarang: '',
    penerbit: '',
    tahunTerbit: new Date().getFullYear(),
    isbn: '',
    kategoriId: '',
    sinopsis: '',
    stokTotal: 1,
    coverUrl: '',
  });

  const [errors, setErrors] = useState({});
  const [coverPreview, setCoverPreview] = useState(null);

  useEffect(() => {
    if (book) {
      setFormData({
        judul: book.judul || '',
        pengarang: book.pengarang || '',
        penerbit: book.penerbit || '',
        tahunTerbit: book.tahunTerbit || new Date().getFullYear(),
        isbn: book.isbn || '',
        kategoriId: book.kategoriId || '',
        sinopsis: book.sinopsis || '',
        stokTotal: book.stokTotal || 1,
        coverUrl: book.coverUrl || '',
      });
      if (book.coverUrl) {
        setCoverPreview(book.coverUrl);
      }
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, cover: 'File harus berupa gambar' }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, cover: 'Ukuran file maksimal 5MB' }));
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // For now, we'll use a placeholder URL
      // In production, you'd upload to a server and get the URL
      const fileName = file.name;
      setFormData((prev) => ({
        ...prev,
        coverUrl: `/uploads/books/${Date.now()}-${fileName}`,
      }));

      setErrors((prev) => ({ ...prev, cover: '' }));
    }
  };

  const removeCover = () => {
    setCoverPreview(null);
    setFormData((prev) => ({ ...prev, coverUrl: '' }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.judul.trim()) {
      newErrors.judul = 'Judul harus diisi';
    }

    if (!formData.pengarang.trim()) {
      newErrors.pengarang = 'Pengarang harus diisi';
    }

    if (!formData.penerbit.trim()) {
      newErrors.penerbit = 'Penerbit harus diisi';
    }

    if (!formData.tahunTerbit || formData.tahunTerbit < 1000 || formData.tahunTerbit > new Date().getFullYear() + 1) {
      newErrors.tahunTerbit = 'Tahun terbit tidak valid';
    }

    if (!formData.isbn.trim()) {
      newErrors.isbn = 'ISBN harus diisi';
    }

    if (!formData.kategoriId) {
      newErrors.kategoriId = 'Kategori harus dipilih';
    }

    if (!formData.stokTotal || formData.stokTotal < 1) {
      newErrors.stokTotal = 'Stok minimal 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit(formData);
  };

  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.namaKategori,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Cover Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Cover Buku
        </label>
        {coverPreview ? (
          <div className="relative w-32 h-48 rounded-lg overflow-hidden">
            <img
              src={coverPreview}
              alt="Cover preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={removeCover}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Upload className="w-10 h-10 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Klik untuk upload cover
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
        {errors.cover && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.cover}</p>
        )}
      </div>

      {/* Title */}
      <Input
        label="Judul Buku"
        name="judul"
        value={formData.judul}
        onChange={handleChange}
        error={errors.judul}
        required
      />

      {/* Author */}
      <Input
        label="Pengarang"
        name="pengarang"
        value={formData.pengarang}
        onChange={handleChange}
        error={errors.pengarang}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Publisher */}
        <Input
          label="Penerbit"
          name="penerbit"
          value={formData.penerbit}
          onChange={handleChange}
          error={errors.penerbit}
          required
        />

        {/* Year */}
        <Input
          label="Tahun Terbit"
          name="tahunTerbit"
          type="number"
          value={formData.tahunTerbit}
          onChange={handleChange}
          error={errors.tahunTerbit}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ISBN */}
        <Input
          label="ISBN"
          name="isbn"
          value={formData.isbn}
          onChange={handleChange}
          error={errors.isbn}
          required
        />

        {/* Category */}
        <Select
          label="Kategori"
          name="kategoriId"
          value={formData.kategoriId}
          onChange={handleChange}
          options={categoryOptions}
          placeholder="Pilih kategori"
          error={errors.kategoriId}
          required
        />
      </div>

      {/* Stock */}
      <Input
        label="Stok Total"
        name="stokTotal"
        type="number"
        min="1"
        value={formData.stokTotal}
        onChange={handleChange}
        error={errors.stokTotal}
        required
        helperText={book ? `Stok tersedia: ${book.stokTersedia}` : ''}
      />

      {/* Synopsis */}
      <Textarea
        label="Sinopsis"
        name="sinopsis"
        value={formData.sinopsis}
        onChange={handleChange}
        rows={4}
        placeholder="Ringkasan cerita buku..."
      />

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-4">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
          Batal
        </Button>
        <Button type="submit" loading={loading}>
          {book ? 'Perbarui' : 'Tambah'} Buku
        </Button>
      </div>
    </form>
  );
}
