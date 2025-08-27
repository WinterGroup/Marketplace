'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Order, ordersApi, productsApi, Product } from '@/lib/api-clients';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart, CheckCircle, Clock, User, AlertCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

export default function OrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Record<number, Product>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const success = searchParams.get('success');
  const productId = searchParams.get('product');

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    if (success === 'true') {
      // Показываем сообщение об успешном заказе
      setTimeout(() => {
        router.replace('/order');
      }, 3000);
    }
    
    loadOrders();
  }, [user, success, router]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      setError('');
      // Здесь нужно загрузить заказы пользователя
      // Пока что используем заглушку
      const mockOrders: Order[] = [
        {
          id: 1,
          seller_id: 1,
          buyer_id: user?.id || 1,
          product_id: 1,
          created_at: new Date().toISOString()
        }
      ];
      
      setOrders(mockOrders);
      
      // Загружаем информацию о продуктах
      const productsData: Record<number, Product> = {};
      for (const order of mockOrders) {
        try {
          const product = await productsApi.getProductById(order.product_id);
          if (product) {
            productsData[order.product_id] = product;
          }
        } catch (error) {
          console.error(`Ошибка при загрузке продукта ${order.product_id}:`, error);
        }
      }
      setProducts(productsData);
      
    } catch (error: any) {
      console.error('Ошибка при загрузке заказов:', error);
      setError(error.message || 'Ошибка при загрузке заказов');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRetry = () => {
    loadOrders();
  };

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <main className="px-4 py-10">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-foreground mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Загрузка заказов...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error && !isLoading) {
    return (
      <main className="px-4 py-10">
        <div className="container mx-auto">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-4">Ошибка загрузки</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
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

        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Мои заказы
          </h1>
          <p className="text-xl text-muted-foreground">
            {user.account_status === 'buyer' ? 'История ваших покупок' : 'История ваших продаж'}
          </p>
        </div>

        {/* Сообщение об успешном заказе */}
        {success === 'true' && (
          <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800">Заказ успешно оформлен!</h3>
                <p className="text-green-700">Ваш заказ был создан и ожидает обработки.</p>
              </div>
            </div>
          </div>
        )}

        {/* Список заказов */}
        {orders.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Заказы отсутствуют
            </h3>
            <p className="text-muted-foreground mb-6">
              {user.account_status === 'buyer' 
                ? 'Вы еще не совершили ни одной покупки' 
                : 'У вас пока нет продаж'
              }
            </p>
            <Link href="/">
              <Button>Перейти к продуктам</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const product = products[order.product_id];
              
              return (
                <div key={order.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <ShoppingCart className="h-5 w-5 text-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          Заказ #{order.id}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Статус</div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">В обработке</span>
                      </div>
                    </div>
                  </div>

                  {product && (
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground mb-2">
                            {product.name}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {product.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {user.account_status === 'buyer' ? 'Продавец' : 'Покупатель'}: {product.username}
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-right ml-4">
                          <div className="text-lg font-bold text-foreground">
                            {product.price.toLocaleString()} ₽
                          </div>
                          <div className="text-sm text-muted-foreground">Цена</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        ID заказа: {order.id}
                      </div>
                      
                      <div className="flex gap-2">
                        <Link href={`/products/${order.product_id}`}>
                          <Button variant="outline" size="sm">
                            Просмотр товара
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
