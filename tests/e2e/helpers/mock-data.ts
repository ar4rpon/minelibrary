/**
 * テスト用のモックデータ定義
 */

export const mockBookData = {
  isbn: '9784798142470',
  title: 'JavaScript入門',
  author: '山田太郎',
  publisher_name: 'テスト出版社',
  sales_date: '2024-01-01',
  item_price: 2800,
  image_url: 'https://example.com/book-cover.jpg',
  item_caption: 'JavaScriptの基礎から応用まで学べる入門書です。',
  genre_id: '001',
};

export const mockBookShelfData = {
  id: 1,
  book_shelf_name: 'プログラミング学習',
  book_shelf_description: 'プログラミングに関する書籍をまとめた本棚です',
  is_public: true,
  user_id: 1,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const mockMemoData = {
  id: 1,
  memo_title: 'JavaScript学習メモ',
  memo: '変数の宣言について学びました',
  isbn: '9784798142470',
  memo_chapter: 1,
  memo_page: 10,
  user_id: 1,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const mockUserData = {
  id: 1,
  name: 'テストユーザー',
  email: 'test@example.com',
  email_verified_at: '2024-01-01T00:00:00Z',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const mockSearchResults = {
  Items: [
    {
      ...mockBookData,
      affiliateUrl: 'https://example.com/affiliate-link',
    },
    {
      isbn: '9784798155681',
      title: 'React実践入門',
      author: '鈴木花子',
      publisher_name: 'リアクト出版',
      sales_date: '2024-02-01',
      item_price: 3200,
      image_url: 'https://example.com/react-book-cover.jpg',
      item_caption: 'Reactの実践的な使い方を学べる書籍です。',
      genre_id: '001',
      affiliateUrl: 'https://example.com/react-affiliate-link',
    },
  ],
  count: 2,
  page: 1,
  pageCount: 1,
};

export const mockFavoriteStatus = {
  isFavorite: false,
};

export const mockShareLinkData = {
  id: 1,
  book_shelf_id: 1,
  share_token: 'abc123def456',
  permission: 'view',
  expires_at: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

/**
 * APIエラーレスポンスのモックデータ
 */
export const mockApiErrors = {
  validation: {
    message: 'The given data was invalid.',
    errors: {
      book_shelf_name: ['本棚名は必須です。'],
      memo: ['メモ内容は必須です。'],
    },
  },
  unauthorized: {
    message: 'Unauthenticated.',
  },
  notFound: {
    message: 'Not Found.',
  },
  serverError: {
    message: 'Internal Server Error.',
  },
};

/**
 * フォームバリデーション用のテストデータ
 */
export const formValidationData = {
  bookShelf: {
    valid: {
      book_shelf_name: 'テスト本棚',
      book_shelf_description: 'テスト用の本棚です',
      is_public: true,
    },
    invalid: {
      empty_name: {
        book_shelf_name: '',
        book_shelf_description: 'テスト用の本棚です',
      },
      too_long_name: {
        book_shelf_name: 'あ'.repeat(256), // 255文字を超える
        book_shelf_description: 'テスト用の本棚です',
      },
    },
  },
  memo: {
    valid: {
      memo_title: 'テストメモ',
      memo: 'テストメモの内容です',
      isbn: '9784798142470',
      memo_chapter: 1,
      memo_page: 10,
    },
    invalid: {
      empty_content: {
        memo_title: 'テストメモ',
        memo: '',
        isbn: '9784798142470',
      },
      invalid_isbn: {
        memo_title: 'テストメモ',
        memo: 'テストメモの内容です',
        isbn: '123', // 無効なISBN
      },
    },
  },
  search: {
    valid: {
      keyword: 'JavaScript',
      searchType: 'keyword',
      genre: '001',
      sort: 'standard',
    },
    invalid: {
      empty_keyword: {
        keyword: '',
        searchType: 'keyword',
      },
      invalid_isbn: {
        keyword: '123',
        searchType: 'isbn',
      },
    },
  },
};

/**
 * パフォーマンステスト用の期待値
 */
export const performanceThresholds = {
  pageLoad: 3000, // 3秒
  apiResponse: 2000, // 2秒
  firstContentfulPaint: 1500, // 1.5秒
  largestContentfulPaint: 2500, // 2.5秒
  cumulativeLayoutShift: 0.1, // 0.1以下
  firstInputDelay: 100, // 100ms
};

/**
 * アクセシビリティテスト用の設定
 */
export const accessibilityConfig = {
  wcagLevel: 'AA',
  tags: ['wcag2a', 'wcag2aa'],
  excludedRules: [
    // 除外するルールがあれば追加
  ],
  thresholds: {
    violations: 0, // 違反は0件
    incomplete: 5, // 不完全な項目は5件まで許容
  },
};

/**
 * 本番環境で使用される実際のISBNコード（テスト用）
 */
export const realIsbnCodes = [
  '9784798142470', // JavaScript入門書
  '9784798155681', // React関連書籍
  '9784774193946', // PHP関連書籍
  '9784297124021', // Python関連書籍
  '9784822292324', // データベース関連書籍
];

/**
 * ジャンルコードとその説明
 */
export const genreCodes = {
  '001': 'コンピュータ・システム開発',
  '002': 'インターネット・eビジネス',
  '003': 'PC・周辺機器',
  '004': 'エンターテイメント',
  '005': 'ゲーム攻略本',
};

/**
 * テスト用のユーザーアカウント
 */
export const testUsers = {
  admin: {
    email: 'admin@example.com',
    password: 'admin123',
    name: '管理者ユーザー',
  },
  regular: {
    email: 'test@example.com',
    password: 'password',
    name: 'テストユーザー',
  },
  guest: {
    email: 'guest@example.com',
    password: 'guest123',
    name: 'ゲストユーザー',
  },
};