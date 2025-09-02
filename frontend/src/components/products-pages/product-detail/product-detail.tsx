'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { productsApi, Product } from '@/lib/api-clients';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

export default function ProductDetailPage() {
  const { id } = useParams(); // получаем id из маршрута
  const router = useRouter();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await productsApi.getProductById(Number(id));
        if (!data) {
          setError('Продукт не найден');
        } else {
          setProduct(data);
        }
      } catch (err: any) {
        setError(err.message || 'Ошибка при загрузке продукта');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <main className="px-4 py-10">
        <div className="container mx-auto text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto" />
          <p className="mt-4 text-muted-foreground">Загрузка продукта...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="px-4 py-10">
        <div className="container mx-auto text-center text-red-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p>{error}</p>
          <Button onClick={() => router.push('/')}>На главную</Button>
        </div>
      </main>
    );
  }

  if (!product) return null;

  return (
    <main className="px-4 py-10">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold mb-4">{product.description}</h1>
        <p className="text-lg font-semibold mb-2">Цена: {product.price.toLocaleString()} ₽</p>
        <p className="text-sm text-muted-foreground mb-6">Продавец: {product.username}</p>

        {user ? (
          <Button
            onClick={() => router.push(`/order?product=${product.id}`)}
            className="w-full"
          >
            Купить
          </Button>
        ) : (
          <p className="text-sm text-muted-foreground">
            Войдите в аккаунт, чтобы купить товар
          </p>
        )}
      </div>
    </main>
  );
}
