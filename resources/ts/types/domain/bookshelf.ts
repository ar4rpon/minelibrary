/**
 * BookShelf Domain Types
 * ドメイン固有の本棚関連型定義
 */

/**
 * BookShelf ベースエンティティ
 */
export interface BookShelfBase {
  bookShelfId: number;
  name: string;
  description: string;
  isPublic: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * BookShelf ドメインエンティティ
 */
export interface BookShelf extends BookShelfBase {
  id: number;
  book_shelf_name: string;
  is_public: boolean;
  created_at?: string;
  updated_at?: string;
  user_id: number;
  books_count?: number;
}

/**
 * 本棚の可視性レベル
 */
export type BookShelfVisibility = 'private' | 'public' | 'shared';

/**
 * 本棚の並び順オプション
 */
export type BookShelfSortOrder =
  | 'created_at'
  | 'updated_at'
  | 'name'
  | 'books_count';

/**
 * 本棚カテゴリ
 */
export interface BookShelfCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

/**
 * 本棚統計情報
 */
export interface BookShelfStats {
  totalBooks: number;
  readBooks: number;
  unreadBooks: number;
  favoriteBooks: number;
  readingProgress: number;
}
