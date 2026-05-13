"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { StudentOnboardingProvider } from "@/contexts/OnboardingContext";
import { WebSocketProvider } from "@/contexts/WebSocketContext";
import "./globals.css";
import { Inter } from "next/font/google";
import { ToastViewport } from "@/components/CustomToast";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthContext();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    document.title = "Talim Students";
  }, [pathname]);

  const publicRoutes = ["/", "/signin", "/register", "/forgot-password"];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && !isPublicRoute) {
        router.push("/signin");
      } else if (isAuthenticated && (pathname === "/signin" || pathname === "/")) {
        // Send to onboarding — it will redirect to dashboard if already complete
        router.push("/onboarding");
      }
    }
  }, [isAuthenticated, isLoading, pathname, router, isPublicRoute]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003366] mx-auto" />
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
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <StudentOnboardingProvider>
            <AuthGuard>
              <WebSocketProvider>
                {children}
                <ToastViewport />
              </WebSocketProvider>
            </AuthGuard>
          </StudentOnboardingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
