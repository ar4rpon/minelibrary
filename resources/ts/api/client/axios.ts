import { ApiErrorHandler } from '@/lib/errors/ApiErrorHandler';
import axios, { AxiosError, AxiosInstance } from 'axios';

/**
 * 統一APIクライアント
 * Laravel + Inertia.js + CSRF対応
 */
class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: '/',
      timeout: 10000,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // リクエストインターセプター
    this.instance.interceptors.request.use(
      (config) => {
        // CSRFトークンの設定（Web routesで使用）
        const token = document
          .querySelector('meta[name="csrf-token"]')
          ?.getAttribute('content');
        if (token) {
          config.headers['X-CSRF-TOKEN'] = token;
        }

        // デバッグ用ログ（開発環境のみ）
        if (process.env.NODE_ENV === 'development') {
          console.debug('API Request:', {
            url: config.url,
            method: config.method,
            headers: config.headers,
            withCredentials: config.withCredentials,
          });
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // レスポンスインターセプター
    this.instance.interceptors.response.use(
      (response) => {
        if (process.env.NODE_ENV === 'development') {
          console.debug('API Response:', {
            url: response.config.url,
            status: response.status,
            data: response.data,
          });
        }
        return response;
      },
      (error: AxiosError) => {
        if (process.env.NODE_ENV === 'development') {
          console.error('API Error:', {
            url: error.config?.url,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
          });
        }
        ApiErrorHandler.handle(error, 'API Request');
      },
    );
  }

  get client(): AxiosInstance {
    return this.instance;
  }

  // 便利メソッド
  async get<T>(url: string, params?: unknown): Promise<T> {
    const response = await this.instance.get(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.instance.post(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.instance.put(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.instance.delete(url);
    return response.data;
  }
}

// シングルトンインスタンス
export const apiClient = new ApiClient();
export default apiClient;
