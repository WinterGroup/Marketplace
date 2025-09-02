import { useState, useEffect, useCallback } from 'react';
import { usersApi, productsApi, ordersApi } from '../lib/api-clients';


// Хук для API запросов
export function useApi<T>(
  apiFunction: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (...args: any[]) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Неизвестная ошибка';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  useEffect(() => {
    if (dependencies.length === 0) {
      execute();
    }
  }, [execute, ...dependencies]);

  return { data, loading, error, execute };
}

// Хук для работы с пользователями
export function useUsers() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await usersApi.login(username, password);
      if (result) {
        const user = await usersApi.getCurrentUser();
        setCurrentUser(user);
        return true;
      } else {
        setError('Неверные учетные данные');
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка при входе');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData: {
    username: string;
    email: string;
    password: string;
    account_status: string;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const user = await usersApi.register(userData);
      setCurrentUser(user);
      return user;
    } catch (err: any) {
      setError(err.message || 'Ошибка при регистрации');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await usersApi.logout();
      setCurrentUser(null);
    } catch (err: any) {
      console.error('Ошибка при выходе:', err);
    }
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const user = await usersApi.getCurrentUser();
      setCurrentUser(user);
      return user;
    } catch (err: any) {
      setCurrentUser(null);
      return null;
    }
  }, []);

  return {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    checkAuth
  };
}

// Хук для работы с продуктами
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // загрузка всех продуктов
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await productsApi.getAllProducts();
      setProducts(data);
      return data;
    } catch (err: any) {
      setError(err.message || "Ошибка при загрузке продуктов");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // получение продукта по ID
  const getProduct = useCallback(async (id: number) => {
    try {
      return await productsApi.getProductById(id);
    } catch (err: any) {
      setError(err.message || "Ошибка при загрузке продукта");
      throw err;
    }
  }, []);

  // поиск продуктов (по username или id)
  const searchProducts = useCallback(async (params: { username?: string; id?: number }) => {
    try {
      return await productsApi.searchProducts(params);
    } catch (err: any) {
      setError(err.message || "Ошибка при поиске продуктов");
      throw err;
    }
  }, []);

  // создание нового продукта
  const createProduct = useCallback(
    async (product: { description: string; price: number; category: string }, token: string) => {
      try {
        const created = await productsApi.createProduct(product, token);
        setProducts((prev) => [...prev, created]);
        return created;
      } catch (err: any) {
        setError(err.message || "Ошибка при создании продукта");
        throw err;
      }
    },
    []
  );

  return {
    products,
    loading,
    error,
    loadProducts,
    getProduct,
    searchProducts,
    createProduct,
  };
}

// Хук для работы с заказами
export function useOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getOrder = useCallback(async (id: number) => {
    try {
      return await ordersApi.getOrder(id);
    } catch (err: any) {
      setError(err.message || 'Ошибка при загрузке заказа');
      throw err;
    }
  }, []);

  const createOrder = useCallback(async (productId: number, sellerId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await ordersApi.createOrder(productId, sellerId);
      if (result) {
        setOrders(prev => [...prev, result]);
        return result;
      } else {
        setError('Не удалось создать заказ');
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка при создании заказа');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    orders,
    loading,
    error,
    getOrder,
    createOrder
  };
}

// Хук для проверки аутентификации
export function useAuth() {
  const { currentUser, checkAuth } = useUsers();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    setIsAuthenticated(!!currentUser);
  }, [currentUser]);

  return {
    isAuthenticated,
    currentUser
  };
}

