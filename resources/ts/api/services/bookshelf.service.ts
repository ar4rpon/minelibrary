import { apiClient } from '@/api/client';
import { ApiErrorHandler } from '@/lib/errors';
import type {
  BookShelfListResponse,
  FavoriteBook,
  ShareLinkResponse,
} from '@/types/api';
import { router } from '@inertiajs/react';

/**
 * BookShelf API サービス
 * 本棚に関連する全てのAPI操作を統一的に管理
 */
export class BookShelfService {
  /**
   * 本棚を更新
   */
  static async updateBookShelf(
    bookShelfId: number,
    name: string,
    description: string,
    isPublic: boolean,
  ): Promise<boolean> {
    try {
      await ApiErrorHandler.executeWithErrorHandling(
        () =>
          apiClient.put(`/book-shelf/update/${bookShelfId}`, {
            book_shelf_name: name,
            description,
            is_public: isPublic,
          }),
        'BookShelfService.updateBookShelf',
      );

      router.reload();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 本棚を削除
   */
  static async deleteBookShelf(bookShelfId: number): Promise<boolean> {
    try {
      await ApiErrorHandler.executeWithErrorHandling(
        () => apiClient.delete(`/book-shelf/delete/${bookShelfId}`),
        'BookShelfService.deleteBookShelf',
      );

      router.visit('/');
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 本棚に本を追加
   */
  static async addBooksToShelf(
    bookShelfId: number,
    isbns: string[],
  ): Promise<boolean> {
    try {
      await ApiErrorHandler.executeWithErrorHandling(
        () =>
          apiClient.post('/book-shelf/add/books', {
            book_shelf_id: bookShelfId,
            isbns,
          }),
        'BookShelfService.addBooksToShelf',
      );

      router.reload();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * お気に入りの本を取得
   */
  static async getFavoriteBooks(): Promise<FavoriteBook[]> {
    try {
      const response = await ApiErrorHandler.executeWithErrorHandling(
        () =>
          apiClient.get<
            Array<{
              isbn: string;
              read_status: string;
              book: {
                title: string;
                author: string;
                sales_date: string;
              };
            }>
          >('/book-shelf/get/favorite-books'),
        'BookShelfService.getFavoriteBooks',
      );

      return response.map((favorite) => ({
        isbn: favorite.isbn,
        title: favorite.book.title,
        author: favorite.book.author,
        sales_date: favorite.book.sales_date,
        read_status: favorite.read_status,
      }));
    } catch (error) {
      return [];
    }
  }

  /**
   * 自分の本棚一覧を取得
   */
  static async getAllBookShelves(): Promise<BookShelfListResponse> {
    try {
      return await ApiErrorHandler.executeWithErrorHandling(
        () => apiClient.get<BookShelfListResponse>('/book-shelf/get/mylist'),
        'BookShelfService.getAllBookShelves',
      );
    } catch (error) {
      return { my: [], favorite: [] };
    }
  }

  /**
   * 共有リンクを生成
   */
  static async generateShareLink(
    bookShelfId: number,
  ): Promise<ShareLinkResponse | null> {
    try {
      const response = await ApiErrorHandler.executeWithErrorHandling(
        () =>
          apiClient.post<ShareLinkResponse>('/book-shelf/generate-share-link', {
            book_shelf_id: bookShelfId,
          }),
        'BookShelfService.generateShareLink',
      );

      if (!response.share_url || !response.expiry_date) {
        console.error('API応答が不完全です:', response);
        return null;
      }

      return response;
    } catch (error) {
      return null;
    }
  }
}

// 型定義は @/types/api から import しています
