import { useAsyncState } from '@/api/hooks';
import { BookService } from '@/api/services';
import type { BookData } from '@/types/api';
import { useEffect, useState } from 'react';

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

    await favoriteState.execute(() => BookService.toggleFavorite(book));

    // エラー時に状態を元に戻す
    if (favoriteState.hasError) {
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
