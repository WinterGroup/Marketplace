'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, usersApi, ApiUtils } from '@/lib/api-clients';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (userData: { username: string; email: string; password: string; account_status: string }) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Проверяем текущего пользователя при загрузке
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    try {
      ApiUtils.logCookies('checkCurrentUser - начало');
      const currentUser = await usersApi.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        console.log('Пользователь успешно получен:', currentUser);
      } else {
        console.log('Пользователь не найден, возможно не аутентифицирован');
        setUser(null);
      }
    } catch (error) {
      console.error('Ошибка при проверке пользователя:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      ApiUtils.logCookies('login - начало');
      
      const success = await usersApi.login(username, password);
      if (success) {
        console.log('Вход успешен, ждем установки cookies...');
        
        // Добавляем небольшую задержку для установки cookies
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Проверяем cookies в браузере
        ApiUtils.logCookies('login - после задержки');
        
        // Пытаемся получить текущего пользователя
        await checkCurrentUser();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Ошибка входа:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: { username: string; email: string; password: string; account_status: string }): Promise<boolean> => {
    try {
      setIsLoading(true);
      const newUser = await usersApi.register(userData);
      setUser(newUser);
      return true;
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      ApiUtils.logCookies('logout - начало');
      
      await usersApi.logout();
      setUser(null);
      
      // Очищаем cookies после выхода
      ApiUtils.clearCookies();
      ApiUtils.logCookies('logout - после очистки');
      
    } catch (error) {
      console.error('Ошибка выхода:', error);
      // Даже если запрос не удался, очищаем локальное состояние
      setUser(null);
      ApiUtils.clearCookies();
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
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
