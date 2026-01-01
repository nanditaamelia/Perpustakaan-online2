'use client';

import { cn } from '@/lib/utils';

/**
 * Input component
 */
export default function Input({
  label,
  error,
  helperText,
  fullWidth = true,
  className,
  containerClassName,
  icon,
  ...props
}) {
  return (
    <div className={cn(fullWidth && 'w-full', containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-gray-400">
              {icon}
            </div>
          </div>
        )}

        <input
          className={cn(
            'w-full px-4 py-2 rounded-lg border transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'bg-white dark:bg-gray-800',
            'text-gray-900 dark:text-gray-100',
            'placeholder-gray-400 dark:placeholder-gray-500',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600',
            icon && 'pl-10',
            props.disabled && 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-900',
            className
          )}
          {...props}
        />
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
}

/**
 * Textarea component
 */
export function Textarea({
  label,
  error,
  helperText,
  fullWidth = true,
  className,
  containerClassName,
  rows = 4,
  ...props
}) {
  return (
    <div className={cn(fullWidth && 'w-full', containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        rows={rows}
        className={cn(
          'w-full px-4 py-2 rounded-lg border transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'bg-white dark:bg-gray-800',
          'text-gray-900 dark:text-gray-100',
          'placeholder-gray-400 dark:placeholder-gray-500',
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 dark:border-gray-600',
          props.disabled && 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-900',
          className
        )}
        {...props}
      />

      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
}
