import { useAsyncState } from '@/api/hooks';
import { MemoService } from '@/api/services';

/**
 * メモ関連の状態と処理を管理するカスタムフック
 */
export function useBookMemo() {
  const memoState = useAsyncState<boolean>();

  // メモを作成
  const createMemo = async (
    isbn: string,
    memo: string,
    chapter?: number,
    page?: number,
  ) => {
    try {
      await memoState.execute(() =>
        MemoService.createMemo({
          isbn,
          memo,
          memo_chapter: chapter,
          memo_page: page,
        }),
      );
      return true;
    } catch (error) {
      console.error('Failed to create memo:', error);
      return false;
    }
  };

  return {
    createMemo,
    isLoading: memoState.loading,
    hasError: memoState.hasError,
    error: memoState.error,
  };
}
