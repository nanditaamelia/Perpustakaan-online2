'use client';

import { Toaster } from 'react-hot-toast';

/**
 * Toast notification wrapper
 * Uses react-hot-toast library
 */
export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 4000,
        style: {
          background: 'var(--toast-bg)',
          color: 'var(--toast-color)',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#ffffff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#ffffff',
          },
        },
        loading: {
          iconTheme: {
            primary: '#3b82f6',
            secondary: '#ffffff',
          },
        },
      }}
    />
  );
}

/**
 * Toast notification helpers
 * Import toast from 'react-hot-toast' and use these patterns:
 *
 * toast.success('Success message')
 * toast.error('Error message')
 * toast.loading('Loading...')
 * toast.promise(promise, {
 *   loading: 'Saving...',
 *   success: 'Saved!',
 *   error: 'Error saving',
 * })
 */
