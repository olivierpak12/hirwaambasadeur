import { NextRequest, NextResponse } from 'next/server';

// Protected route checks
const adminProtectedRoutes = [
  '/admin',
  '/dashboard/admin',
];

const authorProtectedRoutes = [
  '/dashboard/author',
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Admin-only routes
  const isAdminRoute = adminProtectedRoutes.some((route) => pathname.startsWith(route));
  if (isAdminRoute) {
    const token = request.cookies.get('adminToken')?.value;
    if (!token) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Author-only routes
  const isAuthorRoute = authorProtectedRoutes.some((route) => pathname.startsWith(route));
  if (isAuthorRoute) {
    const token = request.cookies.get('authorToken')?.value;
    if (!token) {
      const loginUrl = new URL('/author/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
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
     * - auth (auth routes - allow public access)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|auth|public).*)',
  ],
};
