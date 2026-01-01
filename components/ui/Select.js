'use client';

import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

/**
 * Select component
 */
export default function Select({
  label,
  error,
  helperText,
  options = [],
  fullWidth = true,
  className,
  containerClassName,
  placeholder = 'Pilih...',
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
        <select
          className={cn(
            'w-full px-4 py-2 pr-10 rounded-lg border transition-all duration-200 appearance-none',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'bg-white dark:bg-gray-800',
            'text-gray-900 dark:text-gray-100',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600',
            props.disabled && 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-900',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </div>
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
