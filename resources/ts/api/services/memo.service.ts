import { ApiErrorHandler } from '@/lib/errors';
import type { MemoContent } from '@/types/domain/memo';
import { apiClient } from '../client';

interface CreateMemoRequest {
  isbn: string;
  memo: string;
  memo_chapter?: number;
  memo_page?: number;
}

interface UpdateMemoRequest {
  memo: string;
  memo_chapter?: number;
  memo_page?: number;
}

/**
 * メモ関連のAPIサービス
 */
export const MemoService = {
  /**
   * メモを作成
   */
  createMemo: (request: CreateMemoRequest): Promise<void> => {
    return ApiErrorHandler.executeWithErrorHandling(
      () => apiClient.post('/memo/create', request),
      'MemoService.createMemo',
    );
  },

  /**
   * メモを更新
   */
  updateMemo: (memoId: number, request: UpdateMemoRequest): Promise<void> => {
    return ApiErrorHandler.executeWithErrorHandling(
      () => apiClient.put(`/memo/${memoId}`, request),
      'MemoService.updateMemo',
    );
  },

  /**
   * メモを削除
   */
  deleteMemo: (memoId: number): Promise<void> => {
    return ApiErrorHandler.executeWithErrorHandling(
      () => apiClient.delete(`/memo/${memoId}`),
      'MemoService.deleteMemo',
    );
  },

  /**
   * 書籍のメモ一覧を取得
   */
  getMemosByBook: (isbn: string): Promise<MemoContent[]> => {
    return ApiErrorHandler.executeWithErrorHandling(
      () => apiClient.get(`/memo/book/${isbn}`),
      'MemoService.getMemosByBook',
    );
  },
};
