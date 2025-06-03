import type { BookData } from '@/types/api';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DefaultCard } from '../DefaultCard';

// モック
vi.mock('@inertiajs/react', () => ({
  router: {
    reload: vi.fn(),
  },
}));

// BaseCardをモック（簡単なdivで代替）
vi.mock('@/components/common/BaseCard', () => ({
  BaseCard: ({ children, ...props }: any) => (
    <div data-testid="base-card" {...props}>
      {children}
    </div>
  ),
}));

// FavoriteIconをモック
vi.mock('@/components/common/Icon/FavoriteIcon', () => ({
  default: ({
    isFavorite,
    onClick,
  }: {
    isFavorite: boolean;
    onClick: () => void;
  }) => (
    <button
      data-testid="favorite-icon"
      onClick={onClick}
      aria-label={isFavorite ? 'お気に入り解除' : 'お気に入り追加'}
    >
      {isFavorite ? '★' : '☆'}
    </button>
  ),
}));

// BookDetailDialogをモック
vi.mock('@/components/domain/book/dialogs/BookDetailDialog', () => ({
  BookDetailDialog: ({ isOpen, onClose, title }: any) =>
    isOpen ? (
      <div data-testid="book-detail-dialog">
        <h2>{title}</h2>
        <button onClick={onClose}>閉じる</button>
      </div>
    ) : null,
}));

// HeaderとImageコンポーネントをモック
vi.mock('../elements/Header', () => ({
  Header: ({ title, author, variant }: any) => (
    <div data-testid="header" data-variant={variant}>
      <h3>{title}</h3>
      <p>{author}</p>
    </div>
  ),
}));

vi.mock('../elements/Image', () => ({
  Image: ({ imageUrl, title, variant }: any) => (
    <img
      data-testid="book-image"
      src={imageUrl}
      alt={title}
      data-variant={variant}
    />
  ),
}));

describe('DefaultCard', () => {
  const mockBook: BookData = {
    isbn: '9784297142726',
    title: 'テスト書籍のタイトル',
    author: 'テスト著者',
    sales_date: '2024-01-01',
    item_price: 2500,
    item_url: 'https://example.com/book',
    image_url: 'https://example.com/book-image.jpg',
    publisher_name: 'テスト出版社',
    genre_id: '1',
    item_caption: 'テスト書籍の説明文です。',
  };

  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('書籍情報が正しく表示される', async () => {
    render(<DefaultCard {...mockBook} />);

    // BaseCardが表示される
    expect(screen.getByTestId('base-card')).toBeInTheDocument();

    // 画像が表示される
    const bookImage = screen.getByTestId('book-image');
    expect(bookImage).toBeInTheDocument();
    expect(bookImage).toHaveAttribute('src', mockBook.image_url);
    expect(bookImage).toHaveAttribute('alt', mockBook.title);
    expect(bookImage).toHaveAttribute('data-variant', 'default');

    // ヘッダー情報が表示される
    const header = screen.getByTestId('header');
    expect(header).toBeInTheDocument();
    expect(header).toHaveAttribute('data-variant', 'default');
    expect(screen.getByText(mockBook.title)).toBeInTheDocument();
    expect(screen.getByText(mockBook.author)).toBeInTheDocument();

    // 詳細ボタンが表示される
    expect(
      screen.getByRole('button', { name: '詳細を見る' }),
    ).toBeInTheDocument();

    // お気に入りアイコンが表示される
    expect(screen.getByTestId('favorite-icon')).toBeInTheDocument();
  });

  it('詳細ボタンをクリックするとBookDetailDialogが開く', async () => {
    render(<DefaultCard {...mockBook} />);

    // 初期状態ではダイアログは非表示
    expect(screen.queryByTestId('book-detail-dialog')).not.toBeInTheDocument();

    // 詳細ボタンをクリック
    const detailButton = screen.getByRole('button', { name: '詳細を見る' });
    await user.click(detailButton);

    // ダイアログが表示される
    const dialog = screen.getByTestId('book-detail-dialog');
    expect(dialog).toBeInTheDocument();

    // ダイアログ内にタイトルが表示される
    expect(dialog).toHaveTextContent(mockBook.title);
  });

  it('BookDetailDialogを閉じることができる', async () => {
    render(<DefaultCard {...mockBook} />);

    // 詳細ボタンをクリックしてダイアログを開く
    const detailButton = screen.getByRole('button', { name: '詳細を見る' });
    await user.click(detailButton);

    // ダイアログが表示されることを確認
    expect(screen.getByTestId('book-detail-dialog')).toBeInTheDocument();

    // 閉じるボタンをクリック
    const closeButton = screen.getByRole('button', { name: '閉じる' });
    await user.click(closeButton);

    // ダイアログが閉じられる
    await waitFor(() => {
      expect(
        screen.queryByTestId('book-detail-dialog'),
      ).not.toBeInTheDocument();
    });
  });

  it('お気に入りアイコンをクリックするとお気に入り状態がトグルされる', async () => {
    render(<DefaultCard {...mockBook} />);

    const favoriteIcon = screen.getByTestId('favorite-icon');

    // 初期状態（お気に入りISBNなのでお気に入り状態）
    await waitFor(() => {
      expect(favoriteIcon).toHaveTextContent('★');
      expect(favoriteIcon).toHaveAttribute('aria-label', 'お気に入り解除');
    });

    // お気に入りアイコンをクリック
    await user.click(favoriteIcon);

    // 状態が変更される
    await waitFor(() => {
      expect(favoriteIcon).toHaveTextContent('☆');
      expect(favoriteIcon).toHaveAttribute('aria-label', 'お気に入り追加');
    });
  });

  it('お気に入りではない書籍の場合、初期状態でお気に入りアイコンが空になる', async () => {
    const notFavoriteBook = { ...mockBook, isbn: '9999999999999' };
    render(<DefaultCard {...notFavoriteBook} />);

    const favoriteIcon = screen.getByTestId('favorite-icon');

    // 初期状態（お気に入りでない）
    await waitFor(() => {
      expect(favoriteIcon).toHaveTextContent('☆');
      expect(favoriteIcon).toHaveAttribute('aria-label', 'お気に入り追加');
    });
  });

  it('BookDetailDialogに正しい書籍情報が渡される', async () => {
    render(<DefaultCard {...mockBook} />);

    // 詳細ボタンをクリック
    const detailButton = screen.getByRole('button', { name: '詳細を見る' });
    await user.click(detailButton);

    // ダイアログが正しい情報で表示される
    const dialog = screen.getByTestId('book-detail-dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent(mockBook.title);
  });

  it('BaseCardに正しいプロパティが渡される', () => {
    render(<DefaultCard {...mockBook} />);

    const baseCard = screen.getByTestId('base-card');
    expect(baseCard).toHaveAttribute('isbn', mockBook.isbn);
    expect(baseCard).toHaveAttribute('title', mockBook.title);
    expect(baseCard).toHaveAttribute('variant', 'book-default');
  });

  it('すべての必要なプロパティが子コンポーネントに正しく渡される', () => {
    render(<DefaultCard {...mockBook} />);

    // Header コンポーネントの確認
    const header = screen.getByTestId('header');
    expect(header).toHaveAttribute('data-variant', 'default');

    // Image コンポーネントの確認
    const image = screen.getByTestId('book-image');
    expect(image).toHaveAttribute('data-variant', 'default');
    expect(image).toHaveAttribute('src', mockBook.image_url);
    expect(image).toHaveAttribute('alt', mockBook.title);
  });
});
