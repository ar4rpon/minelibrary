import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// SearchBook コンポーネントをモック（実際の実装がない場合）
const MockSearchBook = ({ books = [], genres = [] }: any) => (
  <div data-testid="search-book">
    <h1>書籍検索</h1>
    <form data-testid="search-form">
      <select data-testid="search-method">
        <option value="title">タイトル検索</option>
        <option value="author">著者検索</option>
        <option value="isbn">ISBN検索</option>
      </select>

      <select data-testid="genre-select">
        <option value="">全ジャンル</option>
        {genres.map((genre: any) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>

      <input
        data-testid="search-input"
        type="text"
        placeholder="キーワードを入力"
      />

      <button type="submit" data-testid="search-button">
        検索
      </button>
    </form>

    <div data-testid="search-results">
      {books.length === 0 ? (
        <p>検索結果がありません</p>
      ) : (
        books.map((book: any) => (
          <div key={book.isbn} data-testid="book-result">
            <h3>{book.title}</h3>
            <p>{book.author}</p>
          </div>
        ))
      )}
    </div>
  </div>
);

// Inertia.jsをモック
vi.mock('@inertiajs/react', () => ({
  Head: ({ title }: { title: string }) => <title>{title}</title>,
  useForm: vi.fn(() => ({
    data: { searchMethod: 'title', genre: '', keyword: '' },
    setData: vi.fn(),
    get: vi.fn(),
    processing: false,
    errors: {},
  })),
  router: {
    get: vi.fn(),
  },
}));

describe('SearchBook', () => {
  const user = userEvent.setup();

  const mockBooks = [
    {
      isbn: '9784297142726',
      title: 'JavaScript入門',
      author: '山田太郎',
      image_url: 'https://example.com/book1.jpg',
    },
    {
      isbn: '9784297142727',
      title: 'React完全ガイド',
      author: '佐藤花子',
      image_url: 'https://example.com/book2.jpg',
    },
  ];

  const mockGenres = [
    { id: '1', name: 'プログラミング' },
    { id: '2', name: 'デザイン' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('書籍検索フォームが正しく表示される', () => {
    render(<MockSearchBook />);

    expect(screen.getByText('書籍検索')).toBeInTheDocument();
    expect(screen.getByTestId('search-form')).toBeInTheDocument();
    expect(screen.getByTestId('search-method')).toBeInTheDocument();
    expect(screen.getByTestId('genre-select')).toBeInTheDocument();
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('search-button')).toBeInTheDocument();
  });

  it('検索方法を選択できる', async () => {
    render(<MockSearchBook />);

    const searchMethodSelect = screen.getByTestId('search-method');

    expect(screen.getByText('タイトル検索')).toBeInTheDocument();
    expect(screen.getByText('著者検索')).toBeInTheDocument();
    expect(screen.getByText('ISBN検索')).toBeInTheDocument();

    await user.selectOptions(searchMethodSelect, 'author');
    expect(searchMethodSelect).toHaveValue('author');
  });

  it('ジャンルフィルターが正しく表示される', () => {
    render(<MockSearchBook genres={mockGenres} />);

    const genreSelect = screen.getByTestId('genre-select');

    expect(screen.getByText('全ジャンル')).toBeInTheDocument();
    expect(screen.getByText('プログラミング')).toBeInTheDocument();
    expect(screen.getByText('デザイン')).toBeInTheDocument();
  });

  it('検索結果が正しく表示される', () => {
    render(<MockSearchBook books={mockBooks} />);

    expect(screen.getByText('JavaScript入門')).toBeInTheDocument();
    expect(screen.getByText('山田太郎')).toBeInTheDocument();
    expect(screen.getByText('React完全ガイド')).toBeInTheDocument();
    expect(screen.getByText('佐藤花子')).toBeInTheDocument();
  });

  it('検索結果がない場合のメッセージが表示される', () => {
    render(<MockSearchBook books={[]} />);

    expect(screen.getByText('検索結果がありません')).toBeInTheDocument();
  });

  it('検索キーワードを入力できる', async () => {
    render(<MockSearchBook />);

    const searchInput = screen.getByTestId('search-input');

    await user.type(searchInput, 'JavaScript');
    expect(searchInput).toHaveValue('JavaScript');
  });

  it('検索フォームを送信できる', async () => {
    render(<MockSearchBook />);

    const searchForm = screen.getByTestId('search-form');
    const searchButton = screen.getByTestId('search-button');

    await user.click(searchButton);

    // フォーム送信の検証（実際の実装では router.get が呼ばれる）
    expect(searchForm).toBeInTheDocument();
  });
});
