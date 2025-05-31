import { useAsyncState } from '@/api/hooks';
import { BookService } from '@/api/services';

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
    return memoState.execute(() =>
      BookService.createMemo({
        isbn,
        memo,
        memo_chapter: chapter,
        memo_page: page,
      }),
    );
  };

  return {
    createMemo,
    isLoading: memoState.loading,
    hasError: memoState.hasError,
    error: memoState.error,
  };
}
