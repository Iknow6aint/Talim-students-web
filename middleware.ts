import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("authToken");

  if (!authToken) {
    // Redirect to login if token is missing
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow the request if the token exists
  return NextResponse.next();
}

// Apply middleware to protected routes
export const config = {
  matcher: ["/dashboard/:path*",
     "/timetable/:path*",  
    "/subjects/:path*",    
    "/resources/:path*",
    "/attendance/:path*",
    "/results/:path*",
    "/messages/:path*"
 ], 
};
