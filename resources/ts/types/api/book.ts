import type { ReadStatus } from '../domain/book';
import { BaseSearchParams, PaginatedResponse } from './common';

/**
 * 本の基本データ
 */
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

/**
 * 読書ステータス付きの本データ
 */
export interface BookWithStatus extends BookData {
  read_status?: ReadStatus;
  is_favorite?: boolean;
}

/**
 * メモ作成データ
 */
export interface CreateMemoData {
  isbn: string;
  memo: string;
  memo_chapter?: number;
  memo_page?: number;
}

/**
 * メモ更新データ
 */
export interface UpdateMemoData {
  memo: string;
  memo_chapter?: number;
  memo_page?: number;
}

/**
 * 本検索パラメータ
 */
export interface BookSearchParams extends BaseSearchParams {
  keyword?: string;
  title?: string;
  author?: string;
  genre?: string;
  isbn?: string;
}

/**
 * お気に入り状態レスポンス
 */
export interface FavoriteStatusResponse {
  isFavorite: boolean;
}

/**
 * 本棚一覧レスポンス
 */
export interface BookshelfListItem {
  id: number;
  book_shelf_name: string;
}

/**
 * 本検索レスポンス
 */
export interface BookSearchResponse extends PaginatedResponse<BookWithStatus> {
  filters?: {
    genre?: string;
    sort?: string;
  };
}

/**
 * 本のお気に入りトグルリクエスト
 */
export interface ToggleFavoriteRequest {
  isbn: string;
  book_data: BookData;
}

/**
 * 読書ステータス更新リクエスト
 */
export interface UpdateReadStatusRequest {
  isbn: string;
  readStatus: ReadStatus;
}
