import { BookService } from '@/Services/bookService';

/**
 * メモ関連の状態と処理を管理するカスタムフック
 */
export function useBookMemo() {
  // メモを作成
  const createMemo = async (
    isbn: string,
    memo: string,
    chapter?: number,
    page?: number,
  ) => {
    return BookService.createMemo({
      isbn,
      memo,
      memo_chapter: chapter,
      memo_page: page,
    });
  };

  return {
    createMemo,
  };
}
