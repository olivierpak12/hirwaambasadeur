import { NextRequest, NextResponse } from 'next/server';

// List of protected admin routes
const protectedRoutes = [
  '/admin',
  '/dashboard',
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute) {
    const token = request.cookies.get('adminToken')?.value;

    if (!token) {
      // Redirect to login if no token
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
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
