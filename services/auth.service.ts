// services/auth.service.ts
import { API_BASE_URL, API_ENDPOINTS } from '@/lib/constants';
import { LoginCredentials, LoginResponse, IntrospectResponse } from '@/types/auth';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await fetch(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    return response.json();
  },

  introspect: async (token: string): Promise<IntrospectResponse> => {
    const response = await fetch(API_ENDPOINTS.INTROSPECT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Token introspection failed');
    }

    return response.json();
  },
};