/**
 * Memo API Types
 * メモ関連API通信型定義
 */

import { ApiResponse, BaseSearchParams } from './common';

/**
 * メモ作成リクエスト
 */
export interface CreateMemoRequest {
  isbn: string;
  memo: string;
  memo_chapter?: number;
  memo_page?: number;
  tags?: string[];
  is_private?: boolean;
}

/**
 * メモ更新リクエスト
 */
export interface UpdateMemoRequest {
  memo?: string;
  memo_chapter?: number;
  memo_page?: number;
  tags?: string[];
  is_private?: boolean;
}

/**
 * メモ検索パラメータ
 */
export interface MemoSearchParams extends BaseSearchParams {
  isbn?: string;
  chapter?: number;
  tags?: string[];
  is_private?: boolean;
  date_from?: string;
  date_to?: string;
}

/**
 * メモAPIレスポンス
 */
export interface MemoData {
  id: number;
  isbn: string;
  memo: string;
  memo_chapter?: number;
  memo_page?: number;
  tags: string[];
  is_private: boolean;
  created_at: string;
  updated_at: string;
  user_id: number;
  book?: {
    title: string;
    author: string;
    image: string;
  };
}

/**
 * メモリストレスポンス
 */
export type MemoListResponse = ApiResponse<MemoData[]>;

/**
 * メモ詳細レスポンス
 */
export type MemoDetailResponse = ApiResponse<MemoData>;

/**
 * メモ作成レスポンス
 */
export interface CreateMemoResponse extends ApiResponse<MemoData> {
  message: string;
}

/**
 * メモ削除レスポンス
 */
export interface DeleteMemoResponse extends ApiResponse<null> {
  message: string;
}

/**
 * メモ統計レスポンス
 */
export interface MemoStatsResponse
  extends ApiResponse<{
    total_memos: number;
    memos_this_week: number;
    memos_this_month: number;
    average_length: number;
    popular_tags: Array<{
      tag: string;
      count: number;
    }>;
  }> {}

/**
 * メモタグレスポンス
 */
export interface MemoTagsResponse
  extends ApiResponse<{
    tags: Array<{
      name: string;
      count: number;
      color?: string;
    }>;
  }> {}
