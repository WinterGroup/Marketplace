'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    account_status: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      toast.error('Имя пользователя обязательно');
      return false;
    }
    if (!formData.email.trim()) {
      toast.error('Email обязателен');
      return false;
    }
    if (!formData.password.trim()) {
      toast.error('Пароль обязателен');
      return false;
    }
    if (!formData.account_status) {
      toast.error('Выберите тип аккаунта');
      return false;
    }
    if (formData.password.length < 6) {
      toast.error('Пароль должен содержать минимум 6 символов');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const result = await register(formData);
      if (result.success) {
        toast.success('Регистрация выполнена успешно!');
        router.push('/');
      } else {
        toast.error(result.error || 'Ошибка при регистрации');
      }
    } catch (err: any) {
      console.error('Ошибка при создании аккаунта:', err);
      toast.error(err.message || 'Ошибка при создании аккаунта');
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
            disabled={isLoading}
          >
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Уже есть аккаунт?{' '}
              <Link href="/auth/login" className="text-primary hover:underline">
                Войти
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
