import { useEffect, useState } from 'react';
import { BookService, BookData } from '@/Services/bookService';

/**
 * お気に入り関連の状態と処理を管理するカスタムフック
 */
export function useFavoriteBook(book: BookData) {
  const [isFavorite, setIsFavorite] = useState(false);

  // お気に入り状態の取得
  useEffect(() => {
    BookService.getFavoriteStatus(book.isbn)
      .then((response) => setIsFavorite(response.data.isFavorite))
      .catch((error) => console.error('Failed to get favorite status:', error));
  }, [book.isbn]);

  // お気に入り状態の更新
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    BookService.toggleFavorite(book)
      .catch((error) => {
        console.error('Failed to toggle favorite:', error);
        setIsFavorite(isFavorite); // エラー時に状態を元に戻す
      });
  };

  return {
    isFavorite,
    toggleFavorite,
  };
}
