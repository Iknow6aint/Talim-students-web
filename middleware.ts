import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /dashboard)
  const path = request.nextUrl.pathname;

  // Get the token from the cookies
  const token = request.cookies.get('access_token')?.value;

  // Define public paths that don't require authentication
  const isPublicPath = path === '/' || path === '/register';

  if (!token && !isPublicPath) {
    // Redirect to login if accessing a protected route without a token
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (token && isPublicPath) {
    // Redirect to dashboard if accessing public route with a token
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/', '/dashboard/:path*', '/messages/:path*']
};
