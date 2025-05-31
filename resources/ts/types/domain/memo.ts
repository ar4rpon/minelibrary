/**
 * Memo Domain Types
 * ドメイン固有のメモ関連型定義
 */

/**
 * MemoContent エンティティ（APIの構造と同じ - snake_case）
 */
export interface MemoContent {
  id: number;
  memo: string;
  memo_chapter?: number;
  memo_page?: number;
  created_at: string;
  updated_at: string;
}

/**
 * Memo ドメインエンティティ（理想的な構造 - camelCase）
 */
export interface Memo {
  id: number;
  isbn: string;
  content: string;
  chapter?: number;
  page?: number;
  tags?: string[];
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

/**
 * メモの種類
 */
export type MemoType = 'note' | 'quote' | 'summary' | 'review' | 'bookmark';

/**
 * メモの可視性
 */
export type MemoVisibility = 'private' | 'public' | 'shared';

/**
 * メモタグ
 */
export interface MemoTag {
  id: string;
  name: string;
  color?: string;
  description?: string;
}

/**
 * メモフィルター条件
 */
export interface MemoFilter {
  type?: MemoType;
  tags?: string[];
  chapter?: number;
  dateRange?: {
    start: string;
    end: string;
  };
  visibility?: MemoVisibility;
}

/**
 * メモ統計情報
 */
export interface MemoStats {
  totalMemos: number;
  memosThisWeek: number;
  memosThisMonth: number;
  averageLength: number;
  tagUsage: Record<string, number>;
}
