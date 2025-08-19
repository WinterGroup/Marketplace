'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth, AuthInterface } from '@/hooks/useAuth';
import { LoginInterface } from '@/lib/auth-api';

interface AuthContextType {
  auth: AuthInterface | null;
  loading: boolean;
  error: string | null;
  signIn: (data: LoginInterface) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { auth, error, loading, login, logout } = useAuth();

  const signIn = async (data: LoginInterface) => {
    await login(data);
  };

  const signOut = async () => {
    await logout();
  };

  return (
    <AuthContext.Provider value={{ auth, loading, error, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used within an AuthProvider');
  return context;
};
