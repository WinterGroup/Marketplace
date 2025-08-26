// API клиенты для работы с бэкендом Marketplace

// Базовые типы
export interface User {
  id: number;
  username: string;
  email: string;
  account_status: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  username: string;
  seller_id?: number;
}

export interface Order {
  id: number;
  seller_id: number;
  buyer_id: number;
  product_id: number;
  created_at: string;
}

// Базовый API клиент
class BaseApiClient {
  protected baseUrl = 'http://localhost/api';

  protected async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Логируем cookies перед запросом
    if (process.env.NODE_ENV === 'development') {
      console.log(`Cookies перед запросом ${endpoint}:`, document.cookie);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      credentials: 'include', // Важно для cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    // Логируем cookies после ответа
    if (process.env.NODE_ENV === 'development') {
      console.log(`Cookies после ответа ${endpoint}:`, document.cookie);
      console.log(`Response headers для ${endpoint}:`, Object.fromEntries(response.headers.entries()));
    }

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (Array.isArray(errorData)) {
          errorMessage = errorData.map(err => 
            typeof err === 'object' && err.msg ? err.msg : JSON.stringify(err)
          ).join(', ');
        }
      } catch (parseError) {
        // Если не удалось распарсить JSON, используем текст ответа
        try {
          const textError = await response.text();
          if (textError) {
            errorMessage = textError;
          }
        } catch (textError) {
          // Игнорируем ошибки парсинга текста
        }
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  protected createQueryString(data: Record<string, any>): string {
    const params = new URLSearchParams();
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        params.append(key, data[key].toString());
      }
    });
    return params.toString();
  }
}

// API клиент для пользователей
export class UsersApi extends BaseApiClient {
  async register(userData: {
    username: string;
    email: string;
    password: string;
    account_status: string;
  }): Promise<User> {
    const queryString = this.createQueryString(userData);
    return this.request<User>(`/users/register?${queryString}`, {
      method: 'POST'
    });
  }

  async login(username: string, password: string): Promise<boolean> {
    const queryString = this.createQueryString({ username, password });
    return this.request<boolean>(`/users/login?${queryString}`, {
      method: 'POST'
    });
  }

  async logout(): Promise<void> {
    return this.request<void>(`/users/logout`, {
      method: 'POST'
    });
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      // Для /me endpoint добавляем специальную обработку
      const response = await fetch(`${this.baseUrl}/users/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Логируем cookies для отладки
      if (process.env.NODE_ENV === 'development') {
        console.log('Cookies для /me:', document.cookie);
        console.log('Response status для /me:', response.status);
        console.log('Response headers для /me:', Object.fromEntries(response.headers.entries()));
      }

      if (!response.ok) {
        if (response.status === 401) {
          console.log('Пользователь не аутентифицирован (401)');
          return null;
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const user = await response.json();
      return user;
    } catch (error) {
      console.error('Ошибка при получении текущего пользователя:', error);
      return null;
    }
  }

  async searchUser(params: { id?: number; username?: string }): Promise<User | null> {
    const queryString = this.createQueryString(params);
    return this.request<User | null>(`/users/search?${queryString}`);
  }
}

// API клиент для продуктов
export class ProductsApi extends BaseApiClient {
  async getAllProducts(): Promise<Product[]> {
    return this.request<Product[]>(`/products/`);
  }

  async getProductById(id: number): Promise<Product | null> {
    try {
      return await this.request<Product>(`/products/search?id=${id}`);
    } catch (error) {
      return null;
    }
  }

  async searchProducts(params: { username?: string; id?: number }): Promise<Product[]> {
    const queryString = this.createQueryString(params);
    return this.request<Product[]>(`/products/search?${queryString}`);
  }
}

// API клиент для заказов
export class OrdersApi extends BaseApiClient {
  async getOrder(id: number): Promise<Order | null> {
    try {
      return await this.request<Order>(`/orders/${id}`);
    } catch (error) {
      return null;
    }
  }

  async createOrder(productId: number, sellerId: number): Promise<Order | false> {
    const queryString = this.createQueryString({ 
      product_id: productId, 
      seller_id: sellerId 
    });
    
    try {
      return await this.request<Order>(`/orders/create?${queryString}`, {
        method: 'POST'
      });
    } catch (error) {
      return false;
    }
  }
}

// Экспорт экземпляров для удобства использования
export const usersApi = new UsersApi();
export const productsApi = new ProductsApi();
export const ordersApi = new OrdersApi();

// Утилиты для работы с API
export class ApiUtils {
  static isAuthenticated(): boolean {
    // Проверяем наличие cookies с токенами
    return document.cookie.includes('access=') || document.cookie.includes('refresh=');
  }

  static getAuthHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json'
    };
  }

  static handleApiError(error: any): string {
    if (error.message) {
      return error.message;
    }
    if (error.status) {
      return `Ошибка ${error.status}`;
    }
    return 'Неизвестная ошибка';
  }

  static logCookies(context: string): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${context}] Cookies:`, document.cookie);
      console.log(`[${context}] Все cookies:`, document.cookie.split(';').map(c => c.trim()));
    }
  }

  static clearCookies(): void {
    // Очищаем все cookies
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
  }
}

