import { useAsyncState } from '@/api/hooks';
import { BookShelfService } from '@/api/services';
import { useMultipleDialogs } from '@/hooks/common';

/**
 * 本棚のベースダイアログ
 */
const BASE_BOOKSHELF_DIALOGS = ['edit', 'delete', 'shareLink'] as const;

/**
 * 本棚の拡張ダイアログ（addBook含む）
 */
const EXTENDED_BOOKSHELF_DIALOGS = [
  'edit',
  'delete',
  'shareLink',
  'addBook',
] as const;

/**
 * 本棚に関する操作と状態を管理するフック
 */
export function useBookShelf(includeAddBook = false) {
  // 条件付きダイアログ管理
  const dialogs = useMultipleDialogs(
    includeAddBook ? EXTENDED_BOOKSHELF_DIALOGS : BASE_BOOKSHELF_DIALOGS,
  );

  // 非同期処理状態管理
  const updateState = useAsyncState<boolean>();
  const deleteState = useAsyncState<boolean>();
  const addBooksState = useAsyncState<boolean>();
  const shareState = useAsyncState<unknown>();

  /**
   * 本棚を更新
   */
  const updateBookShelf = async (
    bookShelfId: number,
    name: string,
    description: string,
    isPublic: boolean,
  ) => {
    const result = await updateState.execute(() =>
      BookShelfService.updateBookShelf(
        bookShelfId,
        name,
        description,
        isPublic,
      ),
    );
    if (result) {
      dialogs.edit.close();
    }
    return result;
  };

  /**
   * 本棚を削除
   */
  const deleteBookShelf = async (bookShelfId: number) => {
    const result = await deleteState.execute(() =>
      BookShelfService.deleteBookShelf(bookShelfId),
    );
    if (result) {
      dialogs.delete.close();
    }
    return result;
  };

  /**
   * 本棚に本を追加
   */
  const addBooksToShelf = async (bookShelfId: number, isbns: string[]) => {
    const result = await addBooksState.execute(() =>
      BookShelfService.addBooksToShelf(bookShelfId, isbns),
    );
    if (result && 'addBook' in dialogs) {
      (dialogs as Record<string, { close: () => void }>).addBook.close();
    }
    return result;
  };

  /**
   * 共有リンクを生成
   */
  const generateShareLink = async (bookShelfId: number) => {
    const result = await shareState.execute(() =>
      BookShelfService.generateShareLink(bookShelfId),
    );
    return result;
  };

  /**
   * お気に入りの本を取得
   */
  const getFavoriteBooks = async () => {
    return BookShelfService.getFavoriteBooks();
  };

  return {
    // ダイアログ状態
    dialogs,

    // 非同期操作
    actions: {
      updateBookShelf,
      deleteBookShelf,
      addBooksToShelf,
      generateShareLink,
      getFavoriteBooks,
    },

    // ローディング・エラー状態
    states: {
      update: updateState,
      delete: deleteState,
      addBooks: addBooksState,
      share: shareState,
    },

    // 便利なフラグ
    isLoading: [updateState, deleteState, addBooksState, shareState].some(
      (state) => state.loading,
    ),
    hasError: [updateState, deleteState, addBooksState, shareState].some(
      (state) => state.hasError,
    ),
  };
}

/**
 * 後方互換性のためのエイリアス（段階的に削除予定）
 */
export const useBookShelfState = useBookShelf;
