import { router } from '@inertiajs/react';
import axios, { AxiosError } from 'axios';

// API エンドポイント定義
const API_ENDPOINTS = {
  UPDATE: (id: number) => `/book-shelf/update/${id}`,
  DELETE: (id: number) => `/book-shelf/delete/${id}`,
  ADD_BOOKS: '/book-shelf/add/books',
  GET_FAVORITE_BOOKS: '/book-shelf/get/favorite-books',
} as const;

// エラーハンドリング用の共通関数
export const handleApiError = (error: unknown, errorMessage: string): void => {
  if (error instanceof AxiosError) {
    console.error(
      `${errorMessage}: ${error.response?.data?.message || error.message}`,
    );
  } else {
    console.error(`${errorMessage}: 予期せぬエラーが発生しました`);
  }
};

// BookShelf 更新
export const updateBookShelf = async (
  bookShelfId: number,
  name: string,
  description: string,
  isPublic: boolean,
): Promise<boolean> => {
  try {
    await axios.put(API_ENDPOINTS.UPDATE(bookShelfId), {
      book_shelf_name: name,
      description,
      is_public: isPublic,
    });
    router.reload();
    return true;
  } catch (error) {
    handleApiError(error, '本棚の更新に失敗しました');
    return false;
  }
};

// BookShelf 削除
export const deleteBookShelf = async (
  bookShelfId: number,
): Promise<boolean> => {
  try {
    await axios.delete(API_ENDPOINTS.DELETE(bookShelfId));
    router.visit('/');
    return true;
  } catch (error) {
    handleApiError(error, '本棚の削除に失敗しました');
    return false;
  }
};

// 本の追加
export const addBooksToShelf = async (
  bookShelfId: number,
  isbns: string[],
): Promise<boolean> => {
  try {
    await axios.post(API_ENDPOINTS.ADD_BOOKS, {
      book_shelf_id: bookShelfId,
      isbns,
    });
    router.reload();
    return true;
  } catch (error) {
    handleApiError(error, '本の追加に失敗しました');
    return false;
  }
};

// お気に入りの本を取得
export const getFavoriteBooks = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.GET_FAVORITE_BOOKS);
    return response.data.map((favorite: any) => ({
      isbn: favorite.isbn,
      title: favorite.book.title,
      author: favorite.book.author,
      sales_date: favorite.book.sales_date,
      read_status: favorite.read_status,
    }));
  } catch (error) {
    handleApiError(error, 'お気に入りの本の取得に失敗しました');
    return [];
  }
};
