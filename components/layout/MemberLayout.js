'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  Library,
  LayoutDashboard,
  User,
  History,
  LogOut,
  BookOpen
} from 'lucide-react';
import DarkModeToggle from '../DarkModeToggle';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

/**
 * Member Layout with Sidebar
 */
export default function MemberLayout({ children, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { href: '/member/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/catalog', label: 'Katalog Buku', icon: BookOpen },
    { href: '/member/history', label: 'Riwayat', icon: History },
    { href: '/member/profile', label: 'Profil', icon: User },
  ];

  const isActive = (href) => pathname === href;

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        toast.success('Logout berhasil!');
        router.push('/login');
      }
    } catch (error) {
      toast.error('Gagal logout');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors lg:hidden"
            >
              <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>

            {/* Logo */}
            <Link href="/member/dashboard" className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg">
                <Library className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent hidden sm:block">
                Perpustakaan Online
              </span>
            </Link>

            {/* User info & dark mode */}
            <div className="flex items-center gap-3">
              <DarkModeToggle />
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {user?.nama}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.noAnggota}
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex flex-col h-full pt-20 lg:pt-5">
            {/* Mobile close button */}
            <div className="flex justify-end px-4 lg:hidden">
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 px-4 space-y-2 mt-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                      isActive(link.href)
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Logout button */}
            <div className="p-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Keluar
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
