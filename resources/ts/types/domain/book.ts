/**
 * Book Domain Types
 * ドメイン固有の本関連型定義
 */

/**
 * 読書ステータス
 */
export type ReadStatus = 'want_read' | 'reading' | 'finished';

/**
 * Book ドメインエンティティ
 */
export interface Book {
  id?: number;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  published_date: string;
  image: string;
  genre: string;
  description?: string;
  page_count?: number;
  read_status?: ReadStatus;
  rating?: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Book Props (UI コンポーネント用) - API 構造に合わせて調整
 */
export interface BookProps {
  id?: number;
  isbn: string;
  title: string;
  author: string;
  publisher_name: string;
  sales_date: string;
  image_url: string;
  item_caption: string;
  item_price: number;
  readStatus?: ReadStatus;
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 本のジャンル定義
 */
export interface BookGenre {
  code: string;
  name: string;
}

/**
 * 読書進捗
 */
export interface ReadingProgress {
  bookId: number;
  currentPage: number;
  totalPages: number;
  percentage: number;
  lastReadAt: string;
}
