import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/auth/login', '/auth/register', '/pricing', '/partners', '/about', '/people', '/help', '/contact', '/privacy'];
  const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith('/blog');

  // Role-based dashboard routes
  const roleDashboardRoutes = [
    '/dashboard/user',
    '/dashboard/influencer',
    '/dashboard/business',
    '/dashboard/business-influencer',
    '/dashboard/moderator',
    '/dashboard/admin'
  ];

  // If user is not authenticated and trying to access protected route
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (token && (pathname === '/auth/login' || pathname === '/auth/register')) {
    return NextResponse.redirect(new URL('/dashboard/user', request.url));
  }

  // If user is accessing the old dashboard route, redirect to user dashboard
  if (token && pathname === '/dashboard') {
    return NextResponse.redirect(new URL('/dashboard/user', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 