import { BookService } from '@/Services/bookService';
import { useEffect, useState } from 'react';

/**
 * 本棚関連の状態と処理を管理するカスタムフック
 */
export function useBookShelf() {
  const [bookshelves, setBookshelves] = useState<
    { id: number; book_shelf_name: string }[]
  >([]);

  // 本棚リストの取得
  const fetchBookshelves = () => {
    BookService.fetchBookshelves()
      .then((response) => setBookshelves(response.data))
      .catch((error) => console.error('Failed to fetch bookshelves:', error));
  };

  useEffect(() => {
    fetchBookshelves();
  }, []);

  // 本棚に本を追加
  const addToBookshelf = (shelfId: number, isbn: string) => {
    BookService.addToBookshelf(shelfId, isbn).catch((error) =>
      console.error('Failed to add book to shelf:', error),
    );
  };

  // 本棚を作成
  const createBookshelf = async (name: string, description: string) => {
    try {
      await BookService.createBookshelf(name, description);
      fetchBookshelves(); // 本棚リストを再取得
      return true;
    } catch (error) {
      console.error('Failed to create bookshelf:', error);
      return false;
    }
  };

  // 本棚から本を削除
  const removeFromBookshelf = async (shelfId: number, isbn: string) => {
    return BookService.removeFromBookshelf(shelfId, isbn);
  };

  return {
    bookshelves,
    addToBookshelf,
    createBookshelf,
    removeFromBookshelf,
  };
}
