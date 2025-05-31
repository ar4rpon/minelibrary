/**
 * Memo Domain Types
 * ドメイン固有のメモ関連型定義
 */

/**
 * Memo Content エンティティ
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
 * Memo ドメインエンティティ
 */
export interface Memo {
  id: number;
  isbn: string;
  content: string;
  chapter?: number;
  page?: number;
  tags?: string[];
  is_private: boolean;
  created_at: string;
  updated_at: string;
  user_id: number;
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
