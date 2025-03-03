import { router } from '@inertiajs/react';
import axios, { AxiosError } from 'axios';

// API エンドポイント定義
const API_ENDPOINTS = {
  UPDATE: (id: number) => `/book-shelf/update/${id}`,
  DELETE: (id: number) => `/book-shelf/delete/${id}`,
  ADD_BOOKS: '/book-shelf/add/books',
  GET_FAVORITE_BOOKS: '/book-shelf/get/favorite-books',
  GET_MY_BOOKSHELVES: '/book-shelf/get/mylist',
  GENERATE_SHARE_LINK: '/book-shelf/generate-share-link',
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

// 自分の本棚一覧を取得
export const getAllBookShelves = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.GET_MY_BOOKSHELVES);
    return response.data;
  } catch (error) {
    handleApiError(error, '本棚一覧の取得に失敗しました');
    return { my: [], favorite: [] };
  }
};

// 共有リンクを生成
export interface ShareLinkResponse {
  share_url: string;
  expiry_date: string;
}

export const generateShareLink = async (
  bookShelfId: number,
): Promise<ShareLinkResponse | null> => {
  try {
    const response = await axios.post(API_ENDPOINTS.GENERATE_SHARE_LINK, {
      book_shelf_id: bookShelfId,
    });

    console.log('API応答:', response.data);

    if (!response.data.share_url || !response.data.expiry_date) {
      console.error('API応答が不完全です:', response.data);
      return null;
    }

    return {
      share_url: response.data.share_url,
      expiry_date: response.data.expiry_date,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('API エラー詳細:', error.response?.data);
    }
    handleApiError(error, '共有リンクの生成に失敗しました');
    return null;
  }
};
