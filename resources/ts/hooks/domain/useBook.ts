import { useAsyncState } from '@/api/hooks';
import { BookService } from '@/api/services';
import { useMultipleDialogs } from '@/hooks/common';
import type { BookData, ReadStatus } from '@/types/api';
import { useState } from 'react';

/**
 * 本カードで使用するダイアログ名
 */
const BOOK_CARD_DIALOGS = [
  'detailBook',
  'readStatus',
  'createBookShelf',
  'deleteBook',
  'createMemo',
] as const;

/**
 * 本に関する操作と状態を管理するフック
 */
export function useBook(initialReadStatus?: ReadStatus) {
  // ダイアログ状態管理
  const dialogs = useMultipleDialogs(BOOK_CARD_DIALOGS);

  // 読書状態管理
  const [selectedStatus, setSelectedStatus] = useState<ReadStatus>(
    initialReadStatus ?? 'want_read',
  );

  // 非同期処理状態管理
  const favoriteState = useAsyncState<void>();
  const statusUpdateState = useAsyncState<void>();
  const bookshelfState = useAsyncState<unknown>();
  const memoState = useAsyncState<boolean>();

  /**
   * お気に入りをトグル
   */
  const toggleFavorite = async (bookData: BookData) => {
    return favoriteState.execute(() => BookService.toggleFavorite(bookData));
  };

  /**
   * 読書ステータスを更新
   */
  const updateReadStatus = async (isbn: string, status: ReadStatus) => {
    await statusUpdateState.execute(() =>
      BookService.updateReadStatus(isbn, status),
    );
    setSelectedStatus(status);
    dialogs.readStatus.close();
  };

  /**
   * 本棚に追加
   */
  const addToBookshelf = async (shelfId: number, isbn: string) => {
    return bookshelfState.execute(() =>
      BookService.addToBookshelf(shelfId, isbn),
    );
  };

  /**
   * 本棚を作成
   */
  const createBookshelf = async (name: string, description: string) => {
    return bookshelfState.execute(() =>
      BookService.createBookshelf(name, description),
    );
  };

  /**
   * メモを作成
   */
  const createMemo = async (
    isbn: string,
    memo: string,
    chapter?: number,
    page?: number,
  ) => {
    const result = await memoState.execute(() =>
      BookService.createMemo({
        isbn,
        memo,
        memo_chapter: chapter,
        memo_page: page,
      }),
    );
    if (result) {
      dialogs.createMemo.close();
    }
    return result;
  };

  return {
    // ダイアログ状態
    dialogs,

    // 読書状態
    readStatus: {
      current: selectedStatus,
      set: setSelectedStatus,
      update: updateReadStatus,
    },

    // 非同期操作
    actions: {
      toggleFavorite,
      updateReadStatus,
      addToBookshelf,
      createBookshelf,
      createMemo,
    },

    // ローディング・エラー状態
    states: {
      favorite: favoriteState,
      statusUpdate: statusUpdateState,
      bookshelf: bookshelfState,
      memo: memoState,
    },

    // 便利なフラグ
    isLoading: [
      favoriteState,
      statusUpdateState,
      bookshelfState,
      memoState,
    ].some((state) => state.loading),
    hasError: [
      favoriteState,
      statusUpdateState,
      bookshelfState,
      memoState,
    ].some((state) => state.hasError),
  };
}

/**
 * 後方互換性のためのエイリアス（段階的に削除予定）
 */
export const useBookCardState = useBook;
