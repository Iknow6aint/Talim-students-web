// hooks/useAuth.ts
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import nookies from "nookies";
import { authService } from "@/services/auth.service";
import { useAuthContext } from "@/contexts/AuthContext";
import { LoginCredentials } from "@/types/auth";

export const useAuth = () => {
  const router = useRouter();
  const { setAuthState } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      // 1. Perform login to get tokens
      const loginResponse = await authService.login(credentials);

      // 2. Use introspect endpoint to get complete user details
      const introspectResponse = await authService.introspect(loginResponse.access_token);

      // 3. Structure user data from introspect response
      const userData = {
        id: introspectResponse.user.userId,
        email: introspectResponse.user.email,
        firstName: introspectResponse.user.firstName,
        lastName: introspectResponse.user.lastName,
        phoneNumber: introspectResponse.user.phoneNumber,
        role: introspectResponse.user.role,
        isActive: introspectResponse.user.isActive,
        isEmailVerified: introspectResponse.user.isEmailVerified
      };

      // 4. Store tokens and user data
      nookies.set(null, "access_token", loginResponse.access_token, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      localStorage.setItem("user", JSON.stringify(userData));
      setAuthState(userData, loginResponse.access_token);

      toast.success("Login successful!");
      router.push("/dashboard");

      return userData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed";
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
  };
};