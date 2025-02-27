import axios, { AxiosError } from 'axios';
import { router } from '@inertiajs/react';

// API エンドポイント定義
const API_ENDPOINTS = {
  UPDATE: (id: number) => `/book-shelf/update/${id}`,
  DELETE: (id: number) => `/book-shelf/delete/${id}`,
  ADD_BOOKS: '/book-shelf/add/books',
} as const;

// エラーハンドリング用の共通関数
export const handleApiError = (error: unknown, errorMessage: string): void => {
  if (error instanceof AxiosError) {
    console.error(`${errorMessage}: ${error.response?.data?.message || error.message}`);
  } else {
    console.error(`${errorMessage}: 予期せぬエラーが発生しました`);
  }
};

// BookShelf 更新
export const updateBookShelf = async (
  bookShelfId: number,
  name: string,
  description: string,
  isPublic: boolean
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
export const deleteBookShelf = async (bookShelfId: number): Promise<boolean> => {
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
  isbns: string[]
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
