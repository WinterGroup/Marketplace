'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth, AuthInterface } from '@/hooks/useAuth';
import { LoginInterface } from '@/lib/auth-api';

interface AuthContextType {
  auth: AuthInterface | null;
  loading: boolean;
  error: string | null;
  signIn: (data: LoginInterface) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { auth, error, loading, login } = useAuth();
  const [user, setUser] = useState<AuthInterface | null>(auth);

  useEffect(() => {
    setUser(auth);
  }, [auth]);

  const signIn = async (data: LoginInterface) => {
    await login(data); 
  };

  const signOut = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ auth: user, loading, error, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used within an AuthProvider');
  return context;
};
