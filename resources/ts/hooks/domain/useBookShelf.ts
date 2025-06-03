import { useAsyncState } from '@/api/hooks';
import { BookService, BookShelfService } from '@/api/services';
import type { BookshelfListItem } from '@/types/api';
import { useCallback, useEffect, useState } from 'react';

/**
 * 本棚関連の状態と処理を管理するカスタムフック
 */
export function useBookShelf() {
  const [bookshelves, setBookshelves] = useState<BookshelfListItem[]>([]);

  const fetchState = useAsyncState<BookshelfListItem[]>();
  const addState = useAsyncState<void>();
  const createState = useAsyncState<unknown>();
  const removeState = useAsyncState<boolean>();

  // 本棚リストの取得
  const fetchBookshelves = useCallback(async () => {
    try {
      const result = await fetchState.execute(() =>
        BookService.fetchBookshelves(),
      );
      setBookshelves(result);
    } catch (error) {
      console.error('Failed to fetch bookshelves:', error);
      setBookshelves([]); // エラー時は空配列を設定
    }
  }, [fetchState.execute]); // executeメソッドのみを依存配列に含める

  useEffect(() => {
    fetchBookshelves();
  }, []); // 空の依存配列で初回のみ実行

  // 本棚に本を追加
  const addToBookshelf = async (shelfId: number, isbn: string) => {
    try {
      await addState.execute(() => BookService.addToBookshelf(shelfId, isbn));
      // 成功時は何もしない（UIからの成功フィードバックは上位コンポーネントで処理）
    } catch (error) {
      console.error('Failed to add book to shelf:', error);
      throw error; // エラーを再スローして上位コンポーネントで処理できるようにする
    }
  };

  // 本棚を作成
  const createBookshelf = async (name: string, description: string) => {
    try {
      await createState.execute(() =>
        BookShelfService.createBookShelf(name, description),
      );
      await fetchBookshelves(); // 本棚リストを再取得
      return true;
    } catch (error) {
      console.error('Failed to create bookshelf:', error);
      throw error; // エラーを再スローして上位コンポーネントで処理できるようにする
    }
  };

  // 本棚から本を削除
  const removeFromBookshelf = async (shelfId: number, isbn: string) => {
    return removeState.execute(() =>
      BookService.removeFromBookshelf(shelfId, isbn),
    );
  };

  return {
    bookshelves,
    addToBookshelf,
    createBookshelf,
    removeFromBookshelf,
    isLoading: [fetchState, addState, createState, removeState].some(
      (state) => state.loading,
    ),
    hasError: [fetchState, addState, createState, removeState].some(
      (state) => state.hasError,
    ),
  };
}
