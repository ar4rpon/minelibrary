import axios from 'axios';
import { router } from '@inertiajs/react';
import { ReadStatus } from '@/types';

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

export const BookService = {
  // お気に入り関連
  getFavoriteStatus: (isbn: string) =>
    axios.get<{ isFavorite: boolean }>('/books/favorite-status', { params: { isbn } }),

  toggleFavorite: (bookData: BookData) =>
    axios.post('/books/toggle-favorite', bookData),

  // 読書状態関連
  updateReadStatus: (isbn: string, readStatus: ReadStatus) =>
    axios.post('/books/update-status', { isbn, readStatus }),

  // 本棚関連
  fetchBookshelves: () =>
    axios.get<{ id: number; book_shelf_name: string }[]>('/book-shelf/get/mylist'),

  addToBookshelf: (shelfId: number, isbn: string) =>
    axios.post('/book-shelf/add/books', { book_shelf_id: shelfId, isbns: [isbn] }),

  createBookshelf: (name: string, description: string) => {
    return axios.post('/book-shelf/create', {
      book_shelf_name: name,
      description
    });
  },

  removeFromBookshelf: async (shelfId: number, isbn: string) => {
    try {
      await axios.post('/book-shelf/remove-book', {
        book_shelf_id: shelfId,
        isbn
      });
      router.reload();
      return true;
    } catch (error) {
      console.error('Failed to remove book from shelf:', error);
      return false;
    }
  },

  // メモ関連
  createMemo: async (data: {
    isbn: string;
    memo: string;
    memo_chapter?: number;
    memo_page?: number;
  }) => {
    try {
      await axios.post('/memo/create', data);
      router.reload();
      return true;
    } catch (error) {
      console.error('Failed to create memo:', error);
      return false;
    }
  }
};
