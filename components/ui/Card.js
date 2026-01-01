'use client';

import { cn } from '@/lib/utils';

/**
 * Glassmorphism Card component
 */
export default function Card({
  children,
  className,
  padding = true,
  hover = false,
  gradient = false,
  ...props
}) {
  return (
    <div
      className={cn(
        'rounded-xl border backdrop-blur-sm transition-all duration-300',
        padding && 'p-6',
        hover && 'hover:shadow-xl hover:scale-105 cursor-pointer',
        gradient
          ? 'bg-gradient-to-br from-blue-50/90 to-cyan-50/90 border-blue-200/50 dark:from-blue-950/50 dark:to-cyan-950/50 dark:border-blue-800/50'
          : 'bg-white/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Card Header component
 */
export function CardHeader({ children, className }) {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  );
}

/**
 * Card Title component
 */
export function CardTitle({ children, className }) {
  return (
    <h3 className={cn('text-xl font-bold text-gray-900 dark:text-gray-100', className)}>
      {children}
    </h3>
  );
}

/**
 * Card Description component
 */
export function CardDescription({ children, className }) {
  return (
    <p className={cn('text-sm text-gray-600 dark:text-gray-400', className)}>
      {children}
    </p>
  );
}

/**
 * Card Content component
 */
export function CardContent({ children, className }) {
  return (
    <div className={cn(className)}>
      {children}
    </div>
  );
}

/**
 * Card Footer component
 */
export function CardFooter({ children, className }) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-gray-200 dark:border-gray-700', className)}>
      {children}
    </div>
  );
}
