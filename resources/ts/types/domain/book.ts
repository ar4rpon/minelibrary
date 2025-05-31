/**
 * Book Domain Types
 * ドメイン固有の本関連型定義
 */

/**
 * 読書ステータス
 */
export type ReadStatus = 'want_read' | 'reading' | 'finished';

/**
 * Book ドメインエンティティ（理想的な構造）
 */
export interface Book {
  id?: number;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  publishedDate: string;
  imageUrl: string;
  genre: string;
  description?: string;
  pageCount?: number;
  readStatus?: ReadStatus;
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * BookProps - UIコンポーネント用（APIのBookDataと同じ構造）
 * @deprecated BookDataを直接使用することを推奨
 */
export interface BookProps {
  isbn: string;
  title: string;
  author: string;
  publisher_name: string;
  sales_date: string;
  image_url: string;
  item_caption: string;
  item_price: number;
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
