'use client';

import { cn } from '@/lib/utils';

/**
 * Badge component for status and labels
 */
export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  rounded = true,
  className,
}) {
  const variants = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    info: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',

    // Status-specific badges
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    approved: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    returned: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium',
        variants[variant],
        sizes[size],
        rounded ? 'rounded-full' : 'rounded',
        className
      )}
    >
      {children}
    </span>
  );
}

/**
 * Status Badge with predefined styles
 */
export function StatusBadge({ status, size = 'md' }) {
  const labels = {
    pending: 'Menunggu',
    approved: 'Disetujui',
    rejected: 'Ditolak',
    returned: 'Dikembalikan',
  };

  return (
    <Badge variant={status} size={size}>
      {labels[status] || status}
    </Badge>
  );
}

/**
 * Stock Badge for book availability
 */
export function StockBadge({ available, total, size = 'md' }) {
  const variant = available > 0 ? 'success' : 'danger';
  const text = available > 0 ? `${available}/${total} Tersedia` : 'Habis';

  return (
    <Badge variant={variant} size={size}>
      {text}
    </Badge>
  );
}
