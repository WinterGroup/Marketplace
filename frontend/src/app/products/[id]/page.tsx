'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Product, productsApi, ordersApi } from '@/lib/api-clients';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart, User, Calendar, AlertCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

export default function ProductDetail() {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState('');
  
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const productId = Number(params.id);

  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const loadProduct = async () => {
    try {
      setIsLoading(true);
      setError('');
      const productData = await productsApi.getProductById(productId);
      if (productData) {
        setProduct(productData);
      } else {
        setError('Продукт не найден');
      }
    } catch (error: any) {
      console.error('Ошибка при загрузке продукта:', error);
      setError(error.message || 'Ошибка при загрузке продукта');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!user || !product) return;
    
    try {
      setIsPurchasing(true);
      setError('');
      
      // Получаем seller_id из продукта или используем заглушку
      const sellerId = product.seller_id || 1; // В реальном приложении это должно приходить с продуктом
      const order = await ordersApi.createOrder(product.id, sellerId);
      
      if (order) {
        router.push('/order?success=true');
      } else {
        setError('Ошибка при создании заказа');
      }
    } catch (error: any) {
      console.error('Ошибка при покупке:', error);
      setError(error.message || 'Ошибка при оформлении заказа');
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRetry = () => {
    loadProduct();
  };

  if (isLoading) {
    return (
      <main className="px-4 py-10">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-foreground mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Загрузка продукта...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="px-4 py-10">
        <div className="container mx-auto">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-4">Ошибка</h1>
            <p className="text-muted-foreground mb-6">{error || 'Продукт не найден'}</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={handleRetry} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Попробовать снова
              </Button>
              <Link href="/">
                <Button variant="outline">Вернуться на главную</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 py-10">
      <div className="container mx-auto max-w-4xl">
        {/* Навигация назад */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Назад к продуктам
            </Button>
          </Link>
        </div>

        {/* Основная информация о продукте */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Левая колонка - изображение и основная информация */}
          <div className="space-y-6">
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
              <ShoppingCart className="h-24 w-24 text-muted-foreground" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
                <div className="text-right">
                  <div className="text-2xl font-bold text-foreground">
                    {product.price.toLocaleString()} ₽
                  </div>
                  <div className="text-sm text-muted-foreground">Цена</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Продавец: {product.username}</span>
              </div>
            </div>
          </div>

          {/* Правая колонка - описание и действия */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-3">Описание</h2>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Информация о продавце */}
            <div className="border rounded-lg p-4 bg-muted/50">
              <h3 className="font-semibold text-foreground mb-2">Информация о продавце</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{product.username}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>ID продукта: {product.id}</span>
                </div>
              </div>
            </div>

            {/* Действия */}
            <div className="space-y-4">
              {user ? (
                user.account_status === 'buyer' ? (
                  <div className="space-y-3">
                    <Button 
                      onClick={handlePurchase}
                      disabled={isPurchasing}
                      className="w-full h-12 text-lg"
                    >
                      {isPurchasing ? 'Оформление...' : 'Купить сейчас'}
                    </Button>
                    
                    {error && (
                      <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                        {error}
                      </div>
                    )}
                    
                    <p className="text-xs text-muted-foreground text-center">
                      Нажимая "Купить сейчас", вы соглашаетесь с условиями покупки
                    </p>
                    
                    {/* Отладочная информация для разработки */}
                    {process.env.NODE_ENV === 'development' && (
                      <div className="mt-2 text-xs text-muted-foreground text-center">
                        Запрос: POST /api/orders/create?product_id={product.id}&seller_id={product.seller_id || 1}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center p-4 border rounded-lg bg-muted/50">
                    <p className="text-muted-foreground">
                      Вы являетесь продавцом и не можете покупать товары
                    </p>
                  </div>
                )
              ) : (
                <div className="text-center space-y-3">
                  <p className="text-muted-foreground">
                    Для покупки необходимо войти в систему
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Link href="/auth/login">
                      <Button variant="outline">Войти</Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button>Регистрация</Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
