'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (field: string, value: string) => {
    if (field === 'username') setUsername(value);
    if (field === 'password') setPassword(value);
    // Очищаем ошибку при изменении полей
    if (error) setError('');
  };

  const validateForm = () => {
    if (!username.trim()) {
      setError('Имя пользователя обязательно');
      return false;
    }
    if (!password.trim()) {
      setError('Пароль обязателен');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log('Отправляем данные входа:', { username, password });
      const success = await login(username, password);
      if (success) {
        router.push('/');
      } else {
        setError('Неверные учетные данные');
      }
    } catch (err: any) {
      console.error('Ошибка при входе в систему:', err);
      setError(err.message || 'Ошибка при входе в систему');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Вход в систему</h1>
          <p className="mt-2 text-muted-foreground">
            Войдите в свой аккаунт Marketplace
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="username">Имя пользователя *</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => handleChange('username', e.target.value)}
              required
              className="w-full"
              placeholder="Введите имя пользователя"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Пароль *</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => handleChange('password', e.target.value)}
              required
              className="w-full"
              placeholder="Введите пароль"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Нет аккаунта?{' '}
            <Link href="/auth/register" className="text-foreground hover:underline">
              Зарегистрироваться
            </Link>
          </p>
        </div>

        {/* Отладочная информация */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
            <p className="font-medium mb-2">Отладочная информация:</p>
            <div className="mb-2">
              <p>Данные формы:</p>
              <pre>{JSON.stringify({ username, password }, null, 2)}</pre>
            </div>
            <div className="mb-2">
              <p>Query параметры для API:</p>
              <pre className="bg-white p-2 rounded border">
                POST /api/users/login?{new URLSearchParams({ username, password }).toString()}
              </pre>
            </div>
            <div>
              <p>Текущие cookies:</p>
              <pre className="bg-white p-2 rounded border text-xs">
                {document.cookie || 'Cookies отсутствуют'}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}