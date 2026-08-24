'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '../lib/api';
import { getAccessToken, removeTokens, setTokens } from '../lib/auth';

interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: () => {},
  logout: async () => {},
  checkAuth: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const login = (accessToken: string, refreshToken: string, userData: User) => {
    setTokens(accessToken, refreshToken);
    setUser(userData);
    router.push('/admin');
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await api.post('/auth/logout', { refreshToken });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      removeTokens();
      setUser(null);
      router.push('/login');
    }
  };

  const checkAuth = async () => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      // Redirect if trying to access admin
      if (pathname?.startsWith('/admin')) {
        router.push('/login');
      }
      return;
    }

    try {
      const { data } = await api.get('/auth/me');
      if (data.success) {
         // In a real app, /auth/me should return full user details. We just mock user role for now
         // Since backend only returns payload: {adminId, email, role}
         setUser({
             id: data.data.adminId,
             email: data.data.email,
             name: 'Admin', // Fetch properly in real app
             avatar: null,
             role: data.data.role
         });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      removeTokens();
      setUser(null);
      if (pathname?.startsWith('/admin')) {
        router.push('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
