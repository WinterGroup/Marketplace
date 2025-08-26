'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usersApi, productsApi, ApiUtils } from '@/lib/api-clients';

export default function TestApiPage() {
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);

  const testUsersApi = async () => {
    setIsLoading(true);
    try {
      // Тест получения текущего пользователя
      const currentUser = await usersApi.getCurrentUser();
      setTestResults((prev: Record<string, any>) => ({
        ...prev,
        users: {
          currentUser,
          timestamp: new Date().toISOString()
        }
      }));
    } catch (error: any) {
      setTestResults((prev: Record<string, any>) => ({
        ...prev,
        users: {
          error: error.message,
          timestamp: new Date().toISOString()
        }
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const testProductsApi = async () => {
    setIsLoading(true);
    try {
      // Тест получения всех продуктов
      const products = await productsApi.getAllProducts();
      setTestResults((prev: Record<string, any>) => ({
        ...prev,
        products: {
          count: products.length,
          sample: products.slice(0, 3),
          timestamp: new Date().toISOString()
        }
      }));
    } catch (error: any) {
      setTestResults((prev: Record<string, any>) => ({
        ...prev,
        products: {
          error: error.message,
          timestamp: new Date().toISOString()
        }
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const testAllApis = async () => {
    await Promise.all([
      testUsersApi(),
      testProductsApi()
    ]);
  };

  const clearCookies = () => {
    ApiUtils.clearCookies();
    console.log('Cookies очищены');
  };

  const logCookies = () => {
    ApiUtils.logCookies('test-api-page');
  };

  return (
    <main className="px-4 py-10">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Тестирование API
          </h1>
          <p className="text-xl text-muted-foreground">
            Проверка работоспособности API endpoints
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Button 
            onClick={testUsersApi} 
            disabled={isLoading}
            className="h-20 text-lg"
          >
            Тест Users API
          </Button>
          
          <Button 
            onClick={testProductsApi} 
            disabled={isLoading}
            className="h-20 text-lg"
          >
            Тест Products API
          </Button>
          
          <Button 
            onClick={testAllApis} 
            disabled={isLoading}
            className="h-20 text-lg"
          >
            Тест всех API
          </Button>
        </div>

        {/* Кнопки для работы с cookies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Button 
            onClick={logCookies} 
            variant="outline"
            className="h-12"
          >
            Логировать Cookies
          </Button>
          
          <Button 
            onClick={clearCookies} 
            variant="destructive"
            className="h-12"
          >
            Очистить Cookies
          </Button>
        </div>

        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Тестирование...</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Users API Results */}
          <Card>
            <CardHeader>
              <CardTitle>Users API</CardTitle>
              <CardDescription>
                Результаты тестирования Users API
              </CardDescription>
            </CardHeader>
            <CardContent>
              {testResults.users ? (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    Время: {testResults.users.timestamp}
                  </div>
                  {testResults.users.error ? (
                    <div className="p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                      Ошибка: {testResults.users.error}
                    </div>
                  ) : (
                    <div className="p-2 bg-green-50 border border-green-200 rounded text-green-600 text-sm">
                      Успешно: {testResults.users.currentUser ? 'Пользователь найден' : 'Пользователь не найден'}
                    </div>
                  )}
                  <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                    {JSON.stringify(testResults.users, null, 2)}
                  </pre>
                </div>
              ) : (
                <p className="text-muted-foreground">Нажмите кнопку для тестирования</p>
              )}
            </CardContent>
          </Card>

          {/* Products API Results */}
          <Card>
            <CardHeader>
              <CardTitle>Products API</CardTitle>
              <CardDescription>
                Результаты тестирования Products API
              </CardDescription>
            </CardHeader>
            <CardContent>
              {testResults.products ? (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    Время: {testResults.products.timestamp}
                  </div>
                  {testResults.products.error ? (
                    <div className="p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                      Ошибка: {testResults.products.error}
                    </div>
                  ) : (
                    <div className="p-2 bg-green-50 border border-green-200 rounded text-green-600 text-sm">
                      Успешно: Найдено {testResults.products.count} продуктов
                    </div>
                  )}
                  <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                    {JSON.stringify(testResults.products, null, 2)}
                  </pre>
                </div>
              ) : (
                <p className="text-muted-foreground">Нажмите кнопку для тестирования</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Информация о подключении:</h3>
          <div className="text-sm space-y-1">
            <div>Base URL: http://localhost/api</div>
            <div>Users endpoint: /users/* (через query параметры)</div>
            <div>Products endpoint: /products/* (через query параметры)</div>
            <div>Orders endpoint: /orders/* (через query параметры)</div>
          </div>
          
          <div className="mt-4 p-3 bg-background rounded border">
            <h4 className="font-medium mb-2">Примеры запросов:</h4>
            <div className="text-xs space-y-2 font-mono">
              <div>POST /api/users/register?username=test&password=123&email=test@example.com&account_status=seller</div>
              <div>POST /api/users/login?username=test&password=123</div>
              <div>GET /api/products/search?username=seller1</div>
              <div>POST /api/orders/create?product_id=1&seller_id=1</div>
            </div>
          </div>

          {/* Отображение текущих cookies */}
          <div className="mt-4 p-3 bg-background rounded border">
            <h4 className="font-medium mb-2">Текущие Cookies:</h4>
            <div className="text-xs font-mono bg-muted p-2 rounded">
              {document.cookie || 'Cookies отсутствуют'}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Используйте кнопки выше для работы с cookies
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
