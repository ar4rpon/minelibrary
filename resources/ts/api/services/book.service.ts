import { apiClient } from '@/api/client';
import { ApiErrorHandler } from '@/lib/errors';
import type {
  BookData,
  BookshelfListItem,
  CreateMemoData,
  FavoriteStatusResponse,
  ReadStatus,
} from '@/types/api';
import { router } from '@inertiajs/react';

/**
 * 楽天APIの日付形式（例: "2020年01月01日"）をYYYY-MM-DD形式に変換
 */
function formatSalesDate(salesDate: string): string {
  // "2020年01月01日" -> "2020-01-01"
  const match = salesDate.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
  if (match) {
    const [, year, month, day] = match;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  
  // 既にYYYY-MM-DD形式の場合はそのまま返す
  if (/^\d{4}-\d{2}-\d{2}$/.test(salesDate)) {
    return salesDate;
  }
  
  // その他の形式の場合は元の値を返す（フォールバック）
  return salesDate.substring(0, 10); // 10文字以内に切り詰める
}

/**
 * BookDataをAPI送信用に変換（バリデーション制限に対応）
 */
function prepareBookDataForApi(bookData: BookData): BookData {
  return {
    ...bookData,
    sales_date: formatSalesDate(bookData.sales_date),
    // 他のフィールドも必要に応じて制限内に調整
    title: bookData.title.substring(0, 255),
    author: bookData.author.substring(0, 255),
    publisher_name: bookData.publisher_name.substring(0, 255),
    item_caption: bookData.item_caption.substring(0, 1000),
    image_url: bookData.image_url.substring(0, 500),
  };
}

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
        apiClient.get<{ isFavorite: boolean }>(
          `/api/books/favorite-status?isbn=${isbn}`,
        ),
      'BookService.getFavoriteStatus',
    );
  }

  /**
   * お気に入りをトグル
   */
  static async toggleFavorite(bookData: BookData): Promise<void> {
    const preparedData = prepareBookDataForApi(bookData);
    return ApiErrorHandler.executeWithErrorHandling(
      () => apiClient.post('/api/books/toggle-favorite', preparedData),
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
