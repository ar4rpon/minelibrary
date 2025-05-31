import { BookWithStatus } from './book';
import { BaseSearchParams } from './common';

/**
 * 本棚基本データ
 */
export interface BookShelfData {
  id: number;
  book_shelf_name: string;
  description?: string;
  is_public: boolean;
  user_id: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * 本棚詳細データ（本の情報を含む）
 */
export interface BookShelfDetail extends BookShelfData {
  books?: BookWithStatus[];
  books_count?: number;
  is_favorited?: boolean;
}

/**
 * 本棚作成データ
 */
export interface CreateBookShelfData {
  book_shelf_name: string;
  description: string;
  is_public?: boolean;
}

/**
 * 本棚更新データ
 */
export interface UpdateBookShelfData {
  book_shelf_name?: string;
  description?: string;
  is_public?: boolean;
}

/**
 * 本棚検索パラメータ
 */
export interface BookShelfSearchParams extends BaseSearchParams {
  keyword?: string;
  user_id?: number;
  is_public?: boolean;
}

/**
 * 本棚一覧レスポンス
 */
export interface BookShelfListResponse {
  my: BookShelfData[];
  favorite: BookShelfData[];
}

/**
 * 本棚作成レスポンス
 */
export interface CreateBookShelfResponse {
  id: number;
  book_shelf_name: string;
  description: string;
  is_public: boolean;
  user_id: number;
  created_at: string;
  updated_at: string;
}

/**
 * お気に入りの本レスポンス
 */
export interface FavoriteBook {
  isbn: string;
  title: string;
  author: string;
  sales_date: string;
  read_status: string;
}

/**
 * 共有リンク生成レスポンス
 */
export interface ShareLinkResponse {
  share_url: string;
  expiry_date: string;
}

/**
 * 本棚に本を追加するリクエスト
 */
export interface AddBooksToShelfRequest {
  book_shelf_id: number;
  isbns: string[];
}

/**
 * 本棚から本を削除するリクエスト
 */
export interface RemoveBookFromShelfRequest {
  book_shelf_id: number;
  isbn: string;
}

/**
 * 共有リンク生成リクエスト
 */
export interface GenerateShareLinkRequest {
  book_shelf_id: number;
}
