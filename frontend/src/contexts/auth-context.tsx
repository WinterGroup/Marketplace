'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, usersApi, ApiUtils } from '@/lib/api-clients';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: { username: string; email: string; password: string; account_status: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const currentUser = await usersApi.getCurrentUser();
    if (currentUser) setUser(currentUser);
    else if (!isRefreshing) await refreshAuth();
    setIsLoading(false);
  };

  const refreshAuth = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    const success = await usersApi.refresh();
    if (success) {
      const currentUser = await usersApi.getCurrentUser();
      setUser(currentUser);
    } else {
      setUser(null);
    }
    setIsRefreshing(false);
  };

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const success = await usersApi.login(username, password);
      if (success) {
        const currentUser = await usersApi.getCurrentUser();
        setUser(currentUser);
        return { success: true };
      }
      return { success: false, error: 'Неверные учетные данные' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Ошибка входа' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await usersApi.logout();
    setUser(null);
    setIsLoading(false);
  };

  const register = async (userData: {
    username: string;
    email: string;
    password: string;
    account_status: string;
  }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const newUser = await usersApi.register(userData);
      setUser(newUser);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Ошибка регистрации' };
    } finally {
      setIsLoading(false);
    }
  };  

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register, refreshAuth, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
}
