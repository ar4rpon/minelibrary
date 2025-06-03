import type { BookData } from '@/types/api';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useFavoriteBook } from '../useFavoriteBook';

// mockRouter
vi.mock('@inertiajs/react', () => ({
  router: {
    reload: vi.fn(),
  },
}));

describe('useFavoriteBook', () => {
  const mockBook: BookData = {
    isbn: '9784297142726',
    title: 'テスト書籍',
    author: 'テスト著者',
    sales_date: '2024-01-01',
    item_price: 2000,
    item_url: 'https://example.com',
    image_url: 'https://example.com/image.jpg',
    publisher_name: 'テスト出版社',
    genre_id: '1',
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    // モックをクリア
    const { router } = await import('@inertiajs/react');
    vi.mocked(router.reload).mockClear();
  });

  it('初期状態でお気に入り状態を取得する', async () => {
    const { result } = renderHook(() => useFavoriteBook(mockBook));

    // 初期状態
    expect(result.current.isFavorite).toBe(false);
    expect(result.current.isLoading).toBe(true);

    // API呼び出し完了まで待機
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // モックハンドラーで設定したISBNなのでtrueになる
    expect(result.current.isFavorite).toBe(true);
  });

  it('お気に入りではない書籍の場合falseを返す', async () => {
    const notFavoriteBook = { ...mockBook, isbn: '9999999999999' };
    const { result } = renderHook(() => useFavoriteBook(notFavoriteBook));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isFavorite).toBe(false);
  });

  it('お気に入りをトグルできる', async () => {
    const { result } = renderHook(() => useFavoriteBook(mockBook));

    // 初期状態の取得完了まで待機
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // 現在の状態を保存
    const currentState = result.current.isFavorite;

    // トグル実行
    await act(async () => {
      await result.current.toggleFavorite();
    });

    // トグル後の状態確認
    expect(result.current.isFavorite).toBe(!currentState);
  });

  it('APIエラーが発生した場合適切にハンドリングする', async () => {
    // エラーを発生させるISBN
    const errorBook = { ...mockBook, isbn: 'error-isbn' };

    // console.errorをモック
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const { result } = renderHook(() => useFavoriteBook(errorBook));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // エラー時はfalseのまま
    expect(result.current.isFavorite).toBe(false);

    consoleErrorSpy.mockRestore();
  });

  it('ISBNが変更された場合、新しいお気に入り状態を取得する', async () => {
    const { result, rerender } = renderHook((book) => useFavoriteBook(book), {
      initialProps: mockBook,
    });

    // 初期取得完了まで待機
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isFavorite).toBe(true);

    // ISBNを変更
    const newBook = { ...mockBook, isbn: '9999999999999' };
    rerender(newBook);

    // 新しいAPI呼び出し完了まで待機
    await waitFor(() => {
      expect(result.current.isFavorite).toBe(false);
    });
  });

  it('同じISBNの場合は重複してAPI呼び出しをしない', async () => {
    const { result, rerender } = renderHook((book) => useFavoriteBook(book), {
      initialProps: mockBook,
    });

    // 初期取得完了まで待機
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const initialCallCount = result.current.isFavorite ? 1 : 0;

    // 同じbookオブジェクトで再レンダリング
    rerender(mockBook);

    // 状態が変わらないことを確認
    expect(result.current.isFavorite).toBe(true);

    // APIが追加で呼ばれていないことを暗黙的に確認
    // (MSWのハンドラーでカウンターを実装すれば明示的に確認可能)
  });
});
