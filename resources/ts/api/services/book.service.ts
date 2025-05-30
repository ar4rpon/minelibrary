import { apiClient } from '@/api/client';
import { ApiErrorHandler } from '@/lib/errors';
import { router } from '@inertiajs/react';

/**
 * Book API サービス
 * 本に関連する全てのAPI操作を統一的に管理
 */
export class BookService {
  /**
   * お気に入り状態を取得
   */
  static async getFavoriteStatus(isbn: string): Promise<{ isFavorite: boolean }> {
    return ApiErrorHandler.executeWithErrorHandling(
      () => apiClient.get<{ isFavorite: boolean }>('/books/favorite-status', { isbn }),
      'BookService.getFavoriteStatus'
    );
  }

  /**
   * お気に入りをトグル
   */
  static async toggleFavorite(bookData: BookData): Promise<void> {
    return ApiErrorHandler.executeWithErrorHandling(
      () => apiClient.post('/books/toggle-favorite', bookData),
      'BookService.toggleFavorite'
    );
  }

  /**
   * 読書状態を更新
   */
  static async updateReadStatus(isbn: string, readStatus: ReadStatus): Promise<void> {
    return ApiErrorHandler.executeWithErrorHandling(
      () => apiClient.post('/books/update-status', { isbn, readStatus }),
      'BookService.updateReadStatus'
    );
  }

  /**
   * 本棚一覧を取得
   */
  static async fetchBookshelves(): Promise<Array<{ id: number; book_shelf_name: string }>> {
    return ApiErrorHandler.executeWithErrorHandling(
      () => apiClient.get<Array<{ id: number; book_shelf_name: string }>>('/book-shelf/get/mylist'),
      'BookService.fetchBookshelves'
    );
  }

  /**
   * 本棚に本を追加
   */
  static async addToBookshelf(shelfId: number, isbn: string): Promise<void> {
    return ApiErrorHandler.executeWithErrorHandling(
      () => apiClient.post('/book-shelf/add/books', { 
        book_shelf_id: shelfId, 
        isbns: [isbn] 
      }),
      'BookService.addToBookshelf'
    );
  }

  /**
   * 本棚を作成
   */
  static async createBookshelf(name: string, description: string): Promise<any> {
    return ApiErrorHandler.executeWithErrorHandling(
      () => apiClient.post('/book-shelf/create', {
        book_shelf_name: name,
        description
      }),
      'BookService.createBookshelf'
    );
  }

  /**
   * 本棚から本を削除
   */
  static async removeFromBookshelf(shelfId: number, isbn: string): Promise<boolean> {
    try {
      await ApiErrorHandler.executeWithErrorHandling(
        () => apiClient.post('/book-shelf/remove-book', {
          book_shelf_id: shelfId,
          isbn
        }),
        'BookService.removeFromBookshelf'
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
        () => apiClient.post('/memo/create', data),
        'BookService.createMemo'
      );
      
      router.reload();
      return true;
    } catch (error) {
      console.error('Failed to create memo:', error);
      return false;
    }
  }
}

// 型定義（後でtypes/api/book.tsに移動予定）
export interface BookData {
  isbn: string;
  title: string;
  author: string;
  publisher_name: string;
  sales_date: string;
  image_url: string;
  item_caption: string;
  item_price: number;
}

export type ReadStatus = 'want_read' | 'reading' | 'finished';

export interface CreateMemoData {
  isbn: string;
  memo: string;
  memo_chapter?: number;
  memo_page?: number;
}