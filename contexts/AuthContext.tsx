// contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { User } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  checkAuth: () => Promise<boolean>;
  logout: () => void;
  setAuthState: (user: User | null, token: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  accessToken: null,
  checkAuth: async () => false,
  logout: () => {},
  setAuthState: () => {},
});

export const useAuthContext = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const setAuthState = (newUser: User | null, newToken: string | null) => {
    console.log("🔧 setAuthState called with:", {
      user: newUser ? { id: newUser.id, email: newUser.email } : null,
      hasToken: !!newToken,
      tokenLength: newToken?.length,
    });

    // Save the entire user object without filtering
    setUser(newUser);

    setAccessToken(newToken);
    setIsAuthenticated(!!newUser && !!newToken);

    console.log("🔧 Auth state updated:", {
      hasUser: !!newUser,
      hasToken: !!newToken,
      isAuthenticated: !!newUser && !!newToken,
    });
  };

  const checkAuth = async () => {
    try {
      console.log("🔍 checkAuth starting...");

      // Check localStorage first (primary storage for students app)
      const userStr = localStorage.getItem("user");
      let token = localStorage.getItem("accessToken");

      console.log("🔍 localStorage check:", {
        hasUserStr: !!userStr,
        hasToken: !!token,
        userStrLength: userStr?.length,
        tokenLength: token?.length,
      });

      // Fallback to cookies if no token in localStorage
      if (!token) {
        const cookies = parseCookies();
        token = cookies.access_token;
        console.log("🔍 cookies fallback:", { hasToken: !!token });
      }

      if (token && userStr) {
        try {
          const userData = JSON.parse(userStr) as User;
          console.log("🔍 Parsed user data:", {
            id: userData.id,
            email: userData.email,
          });
          setAuthState(userData, token);
          return true;
        } catch (error) {
          console.error("Failed to parse user data:", error);
          localStorage.removeItem("user");
          localStorage.removeItem("accessToken");
        }
      }

      console.log("🔍 No valid auth data found, setting to null");
      setAuthState(null, null);
      return false;
    } catch (error) {
      console.error("Auth check error:", error);
      setAuthState(null, null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear cookies
    destroyCookie(null, "access_token");
    destroyCookie(null, "refresh_token");

    // Clear localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("studentDetails");

    setAuthState(null, null);

    // Trigger custom auth event for WebSocket context
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("auth-changed", { detail: { type: "logout" } })
      );
    }

    router.push("/");
  };

  useEffect(() => {
    checkAuth();

    // Sync auth state across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user") {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        accessToken,
        checkAuth,
        logout,
        setAuthState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
