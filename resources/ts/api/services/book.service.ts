import { apiClient } from '@/api/client';
import { ApiErrorHandler } from '@/lib/errors';
import type {
  BookData,
  BookshelfListItem,
  CreateBookShelfResponse,
  CreateMemoData,
  FavoriteStatusResponse,
  ReadStatus,
} from '@/types/api';
import { router } from '@inertiajs/react';

/**
 * Book API サービス
 * 本に関連する全てのAPI操作を統一的に管理
 */
export class BookService {
  /**
   * お気に入り状態を取得
   */
  static async getFavoriteStatus(
    isbn: string,
  ): Promise<FavoriteStatusResponse> {
    return ApiErrorHandler.executeWithErrorHandling(
      () =>
        apiClient.get<{ isFavorite: boolean }>(`/api/books/favorite-status?isbn=${isbn}`),
      'BookService.getFavoriteStatus',
    );
  }

  /**
   * お気に入りをトグル
   */
  static async toggleFavorite(bookData: BookData): Promise<void> {
    return ApiErrorHandler.executeWithErrorHandling(
      () => apiClient.post('/api/books/toggle-favorite', bookData),
      'BookService.toggleFavorite',
    );
  }

  /**
   * 読書状態を更新
   */
  static async updateReadStatus(
    isbn: string,
    readStatus: ReadStatus,
  ): Promise<void> {
    return ApiErrorHandler.executeWithErrorHandling(
      () => apiClient.post('/api/books/update-status', { isbn, readStatus }),
      'BookService.updateReadStatus',
    );
  }

  /**
   * 本棚一覧を取得
   */
  static async fetchBookshelves(): Promise<BookshelfListItem[]> {
    return ApiErrorHandler.executeWithErrorHandling(
      () =>
        apiClient.get<Array<{ id: number; book_shelf_name: string }>>(
          '/api/book-shelf/get/mylist',
        ),
      'BookService.fetchBookshelves',
    );
  }

  /**
   * 本棚に本を追加
   */
  static async addToBookshelf(shelfId: number, isbn: string): Promise<void> {
    return ApiErrorHandler.executeWithErrorHandling(
      () =>
        apiClient.post('/api/book-shelf/add/books', {
          book_shelf_id: shelfId,
          isbns: [isbn],
        }),
      'BookService.addToBookshelf',
    );
  }

  /**
   * 本棚を作成
   */
  static async createBookshelf(
    name: string,
    description: string,
  ): Promise<CreateBookShelfResponse> {
    return ApiErrorHandler.executeWithErrorHandling(
      () =>
        apiClient.post('/api/book-shelf/create', {
          book_shelf_name: name,
          description,
        }),
      'BookService.createBookshelf',
    );
  }

  /**
   * 本棚から本を削除
   */
  static async removeFromBookshelf(
    shelfId: number,
    isbn: string,
  ): Promise<boolean> {
    try {
      await ApiErrorHandler.executeWithErrorHandling(
        () =>
          apiClient.post('/api/book-shelf/remove-book', {
            book_shelf_id: shelfId,
            isbn,
          }),
        'BookService.removeFromBookshelf',
      );

      router.reload();
      return true;
    } catch (error) {
      console.error('Failed to remove book from shelf:', error);
      return false;
    }
  }

  /**
   * メモを作成
   */
  static async createMemo(data: CreateMemoData): Promise<boolean> {
    try {
      await ApiErrorHandler.executeWithErrorHandling(
        () => apiClient.post('/api/memo/create', data),
        'BookService.createMemo',
      );

      router.reload();
      return true;
    } catch (error) {
      console.error('Failed to create memo:', error);
      return false;
    }
  }
}

// 型定義は @/types/api から import しています
