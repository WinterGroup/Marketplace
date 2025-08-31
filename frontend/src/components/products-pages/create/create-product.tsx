'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { productsApi } from '@/lib/api-clients';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

export default function CreateProductPage() {
  const { user, getToken } = useAuth(); // токен нужен для X-Access-Token
  const router = useRouter();

  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const token = getToken();
  if (!token) {
    setError('Вы должны быть авторизованы');
    return;
  }

  if (!user?.username) {
    setError('Пользователь не авторизован');
    return;
  }

  try {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const created = await productsApi.createProduct(
      {
        price: parseInt(price, 10),
        name: user.username, // <- добавили обязательный параметр
      },
      token
    );

    setSuccess(`Товар "${created.description}" успешно создан!`);

    setTimeout(() => {
      router.push('/');
    }, 1500);
  } catch (err: any) {
    setError(err.message || 'Ошибка при создании товара');
  } finally {
    setLoading(false);
  }
};



  return (
    <main className="px-4 py-10">
      <div className="container mx-auto max-w-xl">
        <h1 className="text-3xl font-bold text-center mb-8">Создать товар</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Описание</label>
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Например: Игровая клавиатура"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Цена (₽)</label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="4500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Категория</label>
            <Input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="electronics"
              required
            />
          </div>

          {error && (
            <div className="flex items-center text-red-500 gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center text-green-600 gap-2">
              <CheckCircle2 className="w-5 h-5" />
              {success}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Создание...
              </span>
            ) : (
              'Создать товар'
            )}
          </Button>
        </form>
      </div>
    </main>
  );
}
