'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    account_status: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Очищаем ошибку при изменении полей
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Имя пользователя обязательно');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email обязателен');
      return false;
    }
    if (!formData.password.trim()) {
      setError('Пароль обязателен');
      return false;
    }
    if (!formData.account_status) {
      setError('Выберите тип аккаунта');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
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
      console.log('Отправляем данные регистрации:', formData);
      const success = await register(formData);
      if (success) {
        router.push('/');
      } else {
        setError('Ошибка при регистрации');
      }
    } catch (err: any) {
      console.error('Ошибка при создании аккаунта:', err);
      setError(err.message || 'Ошибка при создании аккаунта');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Регистрация</h1>
          <p className="mt-2 text-muted-foreground">
            Создайте новый аккаунт в Marketplace
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
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              required
              className="w-full"
              placeholder="Введите имя пользователя"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
              className="w-full"
              placeholder="Введите email"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Пароль *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              required
              className="w-full"
              placeholder="Введите пароль (минимум 6 символов)"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="account_status">Тип аккаунта *</Label>
            <Select
              value={formData.account_status}
              onValueChange={(value) => handleChange('account_status', value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите тип аккаунта" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buyer">Покупатель</SelectItem>
                <SelectItem value="seller">Продавец</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !formData.account_status}
          >
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Уже есть аккаунт?{' '}
            <Link href="/auth/login" className="text-foreground hover:underline">
              Войти
            </Link>
          </p>
        </div>

        {/* Отладочная информация */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
            <p className="font-medium mb-2">Отладочная информация:</p>
            <div className="mb-2">
              <p>Данные формы:</p>
              <pre>{JSON.stringify(formData, null, 2)}</pre>
            </div>
            <div className="mb-2">
              <p>Query параметры для API:</p>
              <pre className="bg-white p-2 rounded border">
                POST /api/users/register?{new URLSearchParams(formData).toString()}
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