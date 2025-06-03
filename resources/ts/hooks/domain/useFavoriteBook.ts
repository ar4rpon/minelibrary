// 1. React and external libraries
import { useEffect, useState } from 'react';

// 2. Internal API/services
import { useAsyncState } from '@/api/hooks';
import { BookService } from '@/api/services';

// 3. Types
import type { BookData } from '@/types/api';

/**
 * お気に入り関連の状態と処理を管理するカスタムフック
 */
export function useFavoriteBook(book: BookData) {
  const [isFavorite, setIsFavorite] = useState(false);
  const favoriteState = useAsyncState<void>();
  const statusState = useAsyncState<{ isFavorite: boolean }>();

  // お気に入り状態の取得
  useEffect(() => {
    statusState
      .execute(() => BookService.getFavoriteStatus(book.isbn))
      .then((response) => {
        if (response && !statusState.hasError) {
          setIsFavorite(response.isFavorite);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book.isbn]);

  // お気に入り状態の更新
  const toggleFavorite = async () => {
    const previousState = isFavorite;
    setIsFavorite(!isFavorite);

    try {
      await favoriteState.execute(() => BookService.toggleFavorite(book));

      // 成功時は状態を維持
      if (!favoriteState.hasError) {
        // 必要に応じてお気に入り状態を再取得
        await statusState.execute(() =>
          BookService.getFavoriteStatus(book.isbn),
        );
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      // エラー時に状態を元に戻す
      setIsFavorite(previousState);
    }
  };

  return {
    isFavorite,
    toggleFavorite,
    isLoading: favoriteState.loading || statusState.loading,
    hasError: favoriteState.hasError || statusState.hasError,
  };
}
