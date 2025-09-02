'use client';

import { useState, useEffect } from 'react';
import { Product, productsApi } from '@/lib/api-clients';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ShoppingCart, AlertCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

export default function ProductsPage() {
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

  if (error && !isLoading) {
    return (
      <main className="px-4 py-10">
        <div className="container mx-auto text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-4">Ошибка загрузки</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={loadProducts} className="flex items-center gap-2 mx-auto">
            <RefreshCw className="h-4 w-4" />
            Попробовать снова
          </Button>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="px-4 py-10">
        <div className="container mx-auto text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-foreground mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Загрузка продуктов...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 py-10">
      <div className="container mx-auto">
        
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
              <div key={`product-${product.id}`} className="border rounded-lg p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-foreground line-clamp-2">
                    {product.name}
                  </h3>
                  <span suppressHydrationWarning className="text-lg font-bold text-foreground">
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
                        <Button size="sm">Купить</Button>
                      </Link>
                    )}
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
