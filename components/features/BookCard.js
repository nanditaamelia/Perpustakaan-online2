'use client';

import Image from 'next/image';
import { BookOpen, User, Calendar } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { StockBadge } from '../ui/Badge';

/**
 * Book Card component for displaying book information
 */
export default function BookCard({ book, kategori, onView, onBorrow, showActions = true }) {
  return (
    <Card
      hover
      className="h-full flex flex-col cursor-pointer"
      onClick={() => onView?.(book)}
    >
      {/* Book Cover */}
      <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
        {book.coverUrl ? (
          <Image
            src={book.coverUrl}
            alt={book.judul}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-gray-400" />
          </div>
        )}

        {/* Stock badge */}
        <div className="absolute top-2 right-2">
          <StockBadge available={book.stokTersedia} total={book.stokTotal} size="sm" />
        </div>
      </div>

      {/* Book Info */}
      <div className="flex-1">
        {/* Category */}
        {kategori && (
          <Badge
            variant="primary"
            size="sm"
            className="mb-2"
            style={{ backgroundColor: kategori.color + '20', color: kategori.color }}
          >
            {kategori.namaKategori}
          </Badge>
        )}

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
          {book.judul}
        </h3>

        {/* Author */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
          <User className="w-4 h-4" />
          <span className="line-clamp-1">{book.pengarang}</span>
        </div>

        {/* Year */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
          <Calendar className="w-4 h-4" />
          <span>{book.tahunTerbit}</span>
        </div>

        {/* Synopsis */}
        {book.sinopsis && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
            {book.sinopsis}
          </p>
        )}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              onView?.(book);
            }}
          >
            Detail
          </Button>
          {onBorrow && book.stokTersedia > 0 && (
            <Button
              variant="primary"
              size="sm"
              fullWidth
              onClick={(e) => {
                e.stopPropagation();
                onBorrow(book);
              }}
            >
              Pinjam
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
