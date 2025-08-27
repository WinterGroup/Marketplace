'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usersApi, productsApi, ordersApi } from '@/lib/api-clients';
import { toast } from 'sonner';

export default function TestApiPage() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState<string | null>(null);

  const testEndpoint = async (name: string, testFn: () => Promise<any>) => {
    setLoading(name);
    try {
      const result = await testFn();
      setResults(prev => ({ ...prev, [name]: { success: true, data: result } }));
      toast.success(`${name}: Успешно`);
    } catch (error: any) {
      const errorMessage = error.message || 'Неизвестная ошибка';
      setResults(prev => ({ ...prev, [name]: { success: false, error: errorMessage } }));
      toast.error(`${name}: ${errorMessage}`);
    } finally {
      setLoading(null);
    }
  };

  const testUsers = {
    'Регистрация': () => usersApi.register({
      username: 'testuser',
      email: 'test@example.com',
      password: 'testpass123',
      account_status: 'buyer'
    }),
    'Вход': () => usersApi.login('testuser', 'testpass123'),
    'Текущий пользователь': () => usersApi.getCurrentUser(),
    'Поиск пользователя': () => usersApi.searchUser({ username: 'testuser' }),
    'Обновление токена': () => usersApi.refresh(),
    'Выход': () => usersApi.logout()
  };

  const testProducts = {
    'Все продукты': () => productsApi.getAllProducts(),
    'Поиск продукта по ID': () => productsApi.getProductById(1),
    'Поиск продуктов по продавцу': () => productsApi.searchProducts({ username: 'testuser' })
  };

  const testOrders = {
    'Получить заказ': () => ordersApi.getOrder(1),
    'Создать заказ': () => ordersApi.createOrder(1, 1)
  };

  const clearResults = () => {
    setResults({});
    toast.info('Результаты очищены');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Тестирование API</h1>
        <p className="text-muted-foreground mt-2">
          Страница для тестирования всех эндпоинтов API
        </p>
      </div>

      {/* Тестирование пользователей */}
      <Card>
        <CardHeader>
          <CardTitle>API Пользователей</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(testUsers).map(([name, testFn]) => (
            <div key={name} className="flex items-center gap-4">
              <Button
                onClick={() => testEndpoint(name, testFn)}
                disabled={loading === name}
                variant="outline"
                size="sm"
              >
                {loading === name ? 'Тестирование...' : name}
              </Button>
              {results[name] && (
                <div className={`text-sm ${results[name].success ? 'text-green-600' : 'text-red-600'}`}>
                  {results[name].success ? '✅ Успешно' : `❌ Ошибка: ${results[name].error}`}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Тестирование продуктов */}
      <Card>
        <CardHeader>
          <CardTitle>API Продуктов</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(testProducts).map(([name, testFn]) => (
            <div key={name} className="flex items-center gap-4">
              <Button
                onClick={() => testEndpoint(name, testFn)}
                disabled={loading === name}
                variant="outline"
                size="sm"
              >
                {loading === name ? 'Тестирование...' : name}
              </Button>
              {results[name] && (
                <div className={`text-sm ${results[name].success ? 'text-green-600' : 'text-red-600'}`}>
                  {results[name].success ? '✅ Успешно' : `❌ Ошибка: ${results[name].error}`}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Тестирование заказов */}
      <Card>
        <CardHeader>
          <CardTitle>API Заказов</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(testOrders).map(([name, testFn]) => (
            <div key={name} className="flex items-center gap-4">
              <Button
                onClick={() => testEndpoint(name, testFn)}
                disabled={loading === name}
                variant="outline"
                size="sm"
              >
                {loading === name ? 'Тестирование...' : name}
              </Button>
              {results[name] && (
                <div className={`text-sm ${results[name].success ? 'text-green-600' : 'text-red-600'}`}>
                  {results[name].success ? '✅ Успешно' : `❌ Ошибка: ${results[name].error}`}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Кнопки управления */}
      <div className="flex justify-center gap-4">
        <Button 
          onClick={clearResults} 
          variant="outline"
          disabled={Object.keys(results).length === 0}
        >
          Очистить результаты
        </Button>
      </div>

      {/* Отображение результатов */}
      {Object.keys(results).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Результаты тестирования</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded text-sm overflow-auto">
              {JSON.stringify(results, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
