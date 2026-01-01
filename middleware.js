import { NextResponse } from 'next/server';

/**
 * Middleware for route protection and authentication
 * This runs on every request to protected routes
 */
export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Get session cookie
  const sessionCookie = request.cookies.get('session');
  const hasSession = !!sessionCookie?.value;

  // Define public routes (accessible without authentication)
  const publicRoutes = ['/', '/login', '/register', '/catalog'];
  const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith('/api/books') || pathname.startsWith('/api/categories');

  // Define protected routes
  const adminRoutes = pathname.startsWith('/admin');
  const memberRoutes = pathname.startsWith('/member');
  const isProtectedRoute = adminRoutes || memberRoutes;

  // If accessing a protected route without session, redirect to login
  if (isProtectedRoute && !hasSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user has session and tries to access login/register, redirect based on role
  if (hasSession && (pathname === '/login' || pathname === '/register')) {
    // We need to check the user's role from the session
    // Since we can't directly import server-side functions here,
    // we'll redirect to a default route and let the client handle it
    // For better UX, we could make an API call here, but for simplicity:
    return NextResponse.redirect(new URL('/member/dashboard', request.url));
  }

  return NextResponse.next();
}

/**
 * Configure which routes the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
