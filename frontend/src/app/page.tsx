'use client';

import { useState, useEffect } from 'react';
import { Product, productsApi } from '@/lib/api-clients';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ShoppingCart, AlertCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError('');
      const allProducts = await productsApi.getAllProducts();
      setProducts(allProducts);
      setFilteredProducts(allProducts);
    } catch (error: any) {
      console.error('Ошибка при загрузке продуктов:', error);
      setError(error.message || 'Ошибка при загрузке продуктов');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Поиск уже обрабатывается в useEffect
  };

  const handleRetry = () => {
    loadProducts();
  };

  if (error && !isLoading) {
    return (
      <main className="px-4 py-10">
        <div className="container mx-auto">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-4">Ошибка загрузки</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={handleRetry} className="flex items-center gap-2 mx-auto">
              <RefreshCw className="h-4 w-4" />
              Попробовать снова
            </Button>
          </div>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="px-4 py-10">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-foreground mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Загрузка продуктов...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 py-10">
      <div className="container mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Добро пожаловать в Marketplace
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Откройте для себя мир цифровых товаров: игровые аккаунты, программное обеспечение, веб-сайты и многое другое
          </p>
        </div>

        {/* Поиск */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Поиск по названию, описанию или продавцу..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 h-12 text-lg"
            />
          </form>
          
          {/* Отладочная информация для разработки */}
          {process.env.NODE_ENV === 'development' && searchTerm && (
            <div className="mt-2 text-xs text-muted-foreground text-center">
              Поиск будет выполнен через: GET /api/products/search?username={searchTerm}
            </div>
          )}
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-6 border rounded-lg bg-muted/50">
            <div className="text-3xl font-bold text-foreground">{products.length}</div>
            <div className="text-muted-foreground">Всего товаров</div>
          </div>
          <div className="text-center p-6 border rounded-lg bg-muted/50">
            <div className="text-3xl font-bold text-foreground">
              {new Set(products.map(p => p.username)).size}
            </div>
            <div className="text-muted-foreground">Продавцов</div>
          </div>
          <div className="text-center p-6 border rounded-lg bg-muted/50">
            <div className="text-3xl font-bold text-foreground">
              {products.reduce((sum, p) => sum + p.price, 0).toLocaleString()}
            </div>
            <div className="text-muted-foreground">Общая стоимость</div>
          </div>
        </div>

        {/* Список продуктов */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {searchTerm ? 'Товары не найдены' : 'Товары отсутствуют'}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Попробуйте изменить поисковый запрос' : 'Проверьте позже'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-foreground line-clamp-2">
                      {product.name}
                    </h3>
                    <span className="text-lg font-bold text-foreground">
                      {product.price.toLocaleString()} ₽
                    </span>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {product.description}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Продавец: {product.username}
                    </span>
                    
                    <div className="flex gap-2">
                      <Link href={`/products/${product.id}`}>
                        <Button variant="outline" size="sm">
                          Подробнее
                        </Button>
                      </Link>
                      
                      {user && user.account_status === 'buyer' && (
                        <Link href={`/order?product=${product.id}`}>
                          <Button size="sm">
                            Купить
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
