"use client";

import { AuthProvider } from '@/contexts/AuthContext'
import { WebSocketProvider } from '@/contexts/WebSocketContext'
import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuthContext } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

// Component to handle auth checks
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuthContext();
  const pathname = usePathname();
  const router = useRouter();

  // Routes that don't require authentication
  const publicRoutes = ["/", "/signin", "/register", "/forgot-password"];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Debug auth state
  useEffect(() => {
    console.log('🔍 AuthGuard state:', {
      isAuthenticated,
      isLoading,
      pathname,
      isPublicRoute,
      user: user ? { id: user.id, email: user.email } : null
    });
  }, [isAuthenticated, isLoading, pathname, isPublicRoute, user]);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && !isPublicRoute) {
        // User is not authenticated and trying to access protected route
        console.log('🔒 User not authenticated, redirecting to signin');
        router.push("/signin");
      } else if (isAuthenticated && (pathname === "/signin" || pathname === "/")) {
        // User is authenticated and on signin or root page, redirect to dashboard
        console.log('🔓 User authenticated, redirecting to dashboard');
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, pathname, router, isPublicRoute]);

  // Show loading or render children
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003366] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <AuthGuard>
            <WebSocketProvider>
              {children}
              <Toaster position="top-right" />
            </WebSocketProvider>
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  )
}
