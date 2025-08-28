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
  protected baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost'; // Поддержка переменных окружения

  protected async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

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
  private saveTokens(headers: Headers) {
    const access = headers.get('X-Access-Token');
    const refresh = headers.get('X-Refresh-Token');

    console.log('Получены заголовки:', { access, refresh });

    if (access) localStorage.setItem('access_token', access);
    if (refresh) localStorage.setItem('refresh_token', refresh);
  }

  private getAccessToken() {
    return localStorage.getItem('access_token');
  }

  private getRefreshToken() {
    return localStorage.getItem('refresh_token');
  }

  private clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    console.log('Токены очищены');
  }

  async login(username: string, password: string): Promise<boolean> {
    const queryString = this.createQueryString({ username, password });
    console.log('Вход пользователя:', username);

    const res = await fetch(`${this.baseUrl}/api/users/login?${queryString}`, {
      method: 'POST',
      credentials: 'include'
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP ${res.status}`);
    }

    // Сохраняем токены из заголовков независимо от тела ответа
    this.saveTokens(res.headers);

    const success = await res.json();
    console.log('Результат входа:', success);

    return success === true;
  }

  async getCurrentUser(): Promise<User | null> {
    const access = this.getAccessToken();
    if (!access) return null;

    try {
      const res = await fetch(`${this.baseUrl}/api/users/me`, {
        method: 'GET',
        headers: {
          'X-Access-Token': access,
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (res.status === 401) return null;
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const user = await res.json();
      return user;
    } catch (err) {
      console.error('Ошибка получения текущего пользователя:', err);
      return null;
    }
  }

  async refresh(): Promise<boolean> {
    const refresh = this.getRefreshToken();
    if (!refresh) return false;

    try {
      const res = await fetch(`${this.baseUrl}/api/users/refresh`, {
        method: 'GET',
        headers: { 'X-Refresh-Token': refresh },
        credentials: 'include'
      });

      if (!res.ok) return false;

      this.saveTokens(res.headers);
      return true;
    } catch (err) {
      console.error('Ошибка обновления токена:', err);
      return false;
    }
  }

  async logout(): Promise<void> {
    const refresh = this.getRefreshToken();
    if (!refresh) return this.clearTokens();

    try {
      await fetch(`${this.baseUrl}/api/users/logout`, {
        method: 'POST',
        headers: { 'X-Refresh-Token': refresh },
        credentials: 'include'
      });
    } catch (err) {
      console.error('Ошибка выхода:', err);
    } finally {
      this.clearTokens();
    }
  }

  async register(userData: {
    username: string;
    email: string;
    password: string;
    account_status: string;
  }): Promise<User> {
    const queryString = this.createQueryString(userData);
    console.log('Регистрация пользователя:', userData);
  
    const res = await fetch(`${this.baseUrl}/api/users/register?${queryString}`, {
      method: 'POST',
      credentials: 'include'
    });
  
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP ${res.status}`);
    }
  
    // Сохраняем токены из заголовков
    this.saveTokens(res.headers);
  
    const user = await res.json();
    console.log('Пользователь зарегистрирован:', user);
  
    return user;
  }
  
}

// API клиент для продуктов
export class ProductsApi extends BaseApiClient {
  async getAllProducts(): Promise<Product[]> {
    return this.request<Product[]>(`/api/products/`);
  }

  async getProductById(id: number): Promise<Product | null> {
    try {
      return await this.request<Product>(`/api/products/search?id=${id}`);
    } catch (error) {
      return null;
    }
  }

  async searchProducts(params: { username?: string; id?: number }): Promise<Product[]> {
    const queryString = this.createQueryString(params);
    return this.request<Product[]>(`/api/products/search?${queryString}`);
  }
}

// API клиент для заказов
export class OrdersApi extends BaseApiClient {
  async getOrder(id: number): Promise<Order | null> {
    try {
      return await this.request<Order>(`/api/order/${id}`);
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
      return await this.request<Order>(`/api/order/create?${queryString}`, {
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
    return !!localStorage.getItem('access_token');
  }

  static getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'X-Access-Token': token })
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

  static clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  static logTokens(): void {
    console.log('Текущие токены:', {
      access: localStorage.getItem('access_token'),
      refresh: localStorage.getItem('refresh_token')
    });
  }
}

