import './globals.css';
import { Inter } from 'next/font/google';
import ThemeProvider from '@/components/providers/ThemeProvider';
import ToastProvider from '@/components/ui/Toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Perpustakaan Online',
  description: 'Platform perpustakaan digital modern untuk kemudahan akses buku dan manajemen peminjaman',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>
          {children}
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
