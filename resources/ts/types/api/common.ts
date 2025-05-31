/**
 * API共通レスポンス型
 */
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status: number;
}

/**
 * エラーレスポンス型
 */
export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}

/**
 * ページネーション型
 */
export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

/**
 * ページネーション付きレスポンス型
 */
export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: PaginationMeta;
}

/**
 * 検索パラメータの基底型
 */
export interface BaseSearchParams {
  page?: number;
  per_page?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

/**
 * HTTPメソッド型
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * リクエスト設定型
 */
export interface RequestConfig {
  method: HttpMethod;
  url: string;
  data?: unknown;
  params?: unknown;
  headers?: Record<string, string>;
}
