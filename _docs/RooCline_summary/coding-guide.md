# フロントエンドコーディングガイド

このガイドは、MineLibraryプロジェクトのフロントエンド開発における一貫性と保守性を確保するためのものです。新しいコンポーネントやファイルを追加する際は、このガイドに従ってください。

## 1. コンポーネント設計の原則

### 単一責任の原則

- 各コンポーネントは1つの責任のみを持つ
- UIコンポーネントは表示のみ、コンテナコンポーネントはロジックのみを担当

```tsx
// 良い例: UIコンポーネント
export function BookShelfHeader({
    name,
    description,
    onEdit,
    onDelete,
}: BookShelfHeaderProps) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between">
                <CardTitle>{name}</CardTitle>
                <BookShelfActions onEdit={onEdit} onDelete={onDelete} />
            </div>
            <CardDescription>{description}</CardDescription>
        </div>
    );
}

// 良い例: コンテナコンポーネント
export function BookShelfContainer({ bookShelfId }: { bookShelfId: number }) {
    const { bookShelf, isLoading, error } = useBookShelf(bookShelfId);
    const { handleEdit, handleDelete } = useBookShelfActions(bookShelfId);

    if (isLoading) return <LoadingSpinner />;
    if (error) return <ErrorMessage error={error} />;

    return (
        <BookShelfCard
            name={bookShelf.name}
            description={bookShelf.description}
            onEdit={handleEdit}
            onDelete={handleDelete}
        />
    );
}

// 悪い例: 責任が混在したコンポーネント
export function BookShelfCard({ bookShelfId }: { bookShelfId: number }) {
    const [bookShelf, setBookShelf] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // APIリクエストをコンポーネント内で直接行っている
        axios
            .get(`/api/book-shelves/${bookShelfId}`)
            .then((response) => {
                setBookShelf(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setIsLoading(false);
            });
    }, [bookShelfId]);

    // UIとロジックが混在している
    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="card">
            <h2>{bookShelf.name}</h2>
            <p>{bookShelf.description}</p>
            <button
                onClick={() => {
                    // 編集ロジックをコンポーネント内で直接行っている
                    // ...
                }}
            >
                編集
            </button>
        </div>
    );
}
```

### コンポジション（合成）の活用

- 小さなコンポーネントを組み合わせて大きなコンポーネントを作る
- 共通の振る舞いはカスタムフックに抽出する

```tsx
// 良い例: コンポジションの活用
export function BookShelfCard({
    bookShelfId,
    name,
    description,
    isPublic,
}: BookShelfCardProps) {
    return (
        <BaseCard>
            <BookShelfHeader name={name} description={description} />
            <BookShelfContent isPublic={isPublic} />
            <BookShelfFooter bookShelfId={bookShelfId} />
        </BaseCard>
    );
}

// 悪い例: モノリシックなコンポーネント
export function BookShelfCard({
    bookShelfId,
    name,
    description,
    isPublic,
}: BookShelfCardProps) {
    return (
        <div className="card">
            <div className="header">
                <h2>{name}</h2>
                <p>{description}</p>
                <div className="actions">
                    <button>編集</button>
                    <button>削除</button>
                </div>
            </div>
            <div className="content">
                {isPublic ? <span>公開</span> : <span>非公開</span>}
                {/* 多くのコードが続く... */}
            </div>
            <div className="footer">
                <a href={`/book-shelf/${bookShelfId}`}>詳細を見る</a>
            </div>
        </div>
    );
}
```

## 2. ディレクトリ構造とファイル命名

### ディレクトリ構造

- `components/`: 再利用可能なUIコンポーネント
    - `ui/`: 基本UIコンポーネント（ボタン、カード、入力フィールドなど）
    - `book/`: 書籍関連のUIコンポーネント
    - `bookshelf/`: 本棚関連のUIコンポーネント
- `features/`: 機能単位のコンテナコンポーネント
    - `book/`: 書籍機能
    - `bookshelf/`: 本棚機能
- `services/`: APIサービス
- `hooks/`: 共通カスタムフック
- `types/`: 型定義
- `pages/`: ページコンポーネント

### ファイル命名

- コンポーネント: PascalCase（例: `BookShelfCard.tsx`）
- フック: camelCaseで`use`プレフィックス（例: `useBookShelfState.ts`）
- サービス: camelCase（例: `bookShelfService.ts`）
- 型定義: camelCase（例: `bookShelf.ts`）
- インデックスファイル: `index.tsx`（ディレクトリのエントリーポイント）

```
// 良い例
components/
  bookshelf/
    card/
      BaseCard.tsx
      DefaultCard.tsx
      DetailCard.tsx
    elements/
      Header.tsx
      Image.tsx
    index.tsx

// 悪い例
components/
  BookShelf/
    card.tsx
    Card.tsx
    bookshelfcard.tsx
    BookShelfCardComponent.tsx
```

## 3. 型定義の原則

### インターフェースの分割

- 大きなインターフェースは小さく分割する
- 関連する型は同じファイルにまとめる

```ts
// 良い例: インターフェースの分割
// 基本情報
export interface BookShelfBase {
    bookShelfId: number;
    name: string;
    description: string;
    isPublic: boolean;
}

// UI表示用
export interface BookShelfDisplayProps extends BookShelfBase {
    variant?: 'card' | 'description';
    image?: string;
}

// アクション用
export interface BookShelfActionsProps {
    onEdit: () => void;
    onDelete: () => void;
}

// 悪い例: 巨大なインターフェース
export interface BookShelfProps {
    bookShelfId: number;
    name: string;
    description: string;
    isPublic: boolean;
    variant?: 'card' | 'description';
    image?: string;
    onEdit?: () => void;
    onDelete?: () => void;
    onAddBook?: () => void;
    onShare?: () => void;
    isLoading?: boolean;
    error?: string;
    // さらに多くのプロパティ...
}
```

### 型の再利用

- 共通の型は再利用する
- 必要に応じて型を拡張する

```ts
// 良い例: 型の再利用
export interface BookShelfBase {
    bookShelfId: number;
    name: string;
    description: string;
    isPublic: boolean;
}

export interface BookShelfWithImage extends BookShelfBase {
    image?: string;
}

export interface BookShelfWithUser extends BookShelfBase {
    userName?: string;
    userImage?: string;
}

// 悪い例: 型の重複
export interface BookShelf {
    bookShelfId: number;
    name: string;
    description: string;
    isPublic: boolean;
}

export interface BookShelfCard {
    bookShelfId: number;
    name: string;
    description: string;
    isPublic: boolean;
    image?: string;
}

export interface BookShelfDetail {
    bookShelfId: number;
    name: string;
    description: string;
    isPublic: boolean;
    userName?: string;
    userImage?: string;
}
```

## 4. 状態管理の原則

### カスタムフックの活用

- 状態管理はカスタムフックに抽出する
- UIコンポーネントは状態を持たない

```ts
// 良い例: カスタムフックの活用
export function useBookShelfDialogs(bookShelfId: number) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleEdit = async (name: string, description: string, isPublic: boolean) => {
    const success = await updateBookShelf(bookShelfId, name, description, isPublic);
    if (success) {
      setIsEditOpen(false);
    }
  };

  const handleDelete = async () => {
    const success = await deleteBookShelf(bookShelfId);
    if (success) {
      setIsDeleteOpen(false);
    }
  };

  return {
    dialogs: {
      edit: {
        isOpen: isEditOpen,
        open: () => setIsEditOpen(true),
        close: () => setIsEditOpen(false),
        handle: handleEdit,
      },
      delete: {
        isOpen: isDeleteOpen,
        open: () => setIsDeleteOpen(true),
        close: () => setIsDeleteOpen(false),
        handle: handleDelete,
      },
    },
  };
}

// 悪い例: コンポーネント内の状態管理
export function BookShelfCard({ bookShelfId }: { bookShelfId: number }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleEdit = async (name: string, description: string, isPublic: boolean) => {
    // APIリクエストをコンポーネント内で直接行っている
    try {
      await axios.put(`/api/book-shelves/${bookShelfId}`, {
        name,
        description,
        isPublic,
      });
      setIsEditOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  // 他の状態管理コード...

  return (
    // JSX...
  );
}
```

### 状態の局所化

- 状態は必要な最小限のスコープに保持する
- グローバル状態は必要な場合のみ使用する

```tsx
// 良い例: 状態の局所化
function ParentComponent() {
    // 複数の子コンポーネントで共有される状態
    const [selectedId, setSelectedId] = useState(null);

    return (
        <>
            <ChildList onSelect={setSelectedId} />
            <ChildDetail id={selectedId} />
        </>
    );
}

function ChildList({ onSelect }) {
    // このコンポーネント固有の状態
    const [isLoading, setIsLoading] = useState(true);

    // ...
}

// 悪い例: 不必要に広いスコープの状態
function App() {
    // アプリケーション全体で使われない状態をトップレベルで管理
    const [isChildListLoading, setIsChildListLoading] = useState(true);
    const [selectedChildId, setSelectedChildId] = useState(null);
    const [isChildDetailLoading, setIsChildDetailLoading] = useState(true);

    // ...
}
```

## 5. APIリクエストの原則

### サービス層の活用

- APIリクエストはサービス層に抽出する
- エラーハンドリングを統一する

```ts
// 良い例: サービス層の活用
// services/bookShelfService.ts
export const bookShelfService = {
    update: async (
        bookShelfId: number,
        data: UpdateBookShelfData,
    ): Promise<Result<BookShelf>> => {
        try {
            const response = await axios.put(
                API_ENDPOINTS.UPDATE(bookShelfId),
                {
                    book_shelf_name: data.name,
                    description: data.description,
                    is_public: data.isPublic,
                },
            );
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: handleApiError(error, '本棚の更新に失敗しました'),
            };
        }
    },

    delete: async (bookShelfId: number): Promise<Result<void>> => {
        try {
            await axios.delete(API_ENDPOINTS.DELETE(bookShelfId));
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: handleApiError(error, '本棚の削除に失敗しました'),
            };
        }
    },
};

// hooks/useBookShelf.ts
export function useBookShelfMutation(bookShelfId: number) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateBookShelf = async (data: UpdateBookShelfData) => {
        setIsLoading(true);
        setError(null);

        const result = await bookShelfService.update(bookShelfId, data);

        setIsLoading(false);

        if (!result.success) {
            setError(result.error);
            return false;
        }

        return true;
    };

    // 他のミューテーション関数...

    return {
        updateBookShelf,
        // 他の関数...
        isLoading,
        error,
    };
}

// 悪い例: コンポーネント内のAPIリクエスト
export function BookShelfCard({ bookShelfId }: { bookShelfId: number }) {
    const handleEdit = async (
        name: string,
        description: string,
        isPublic: boolean,
    ) => {
        try {
            await axios.put(`/api/book-shelves/${bookShelfId}`, {
                name,
                description,
                isPublic,
            });
            // 成功処理
        } catch (error) {
            // エラー処理（コンポーネントごとに異なる可能性がある）
            console.error(error);
            alert('更新に失敗しました');
        }
    };

    // ...
}
```

## 6. コンポーネントのドキュメント化

### JSDocコメント

- 各コンポーネントにJSDocコメントを追加する
- コンポーネントの目的、使用方法、propsの説明を含める

```tsx
/**
 * 本棚のヘッダーコンポーネント
 *
 * 本棚のタイトル、説明、アクションボタンを表示します。
 *
 * @param name - 本棚の名前
 * @param description - 本棚の説明
 * @param variant - 表示バリアント（'card'または'description'）
 * @param onEdit - 編集ボタンクリック時のコールバック
 * @param onDelete - 削除ボタンクリック時のコールバック
 * @param onAddBook - 本追加ボタンクリック時のコールバック（オプション）
 */
export function BookShelfHeader({
    name,
    description,
    variant = 'card',
    onEdit,
    onDelete,
    onAddBook,
}: BookShelfHeaderProps) {
    // ...
}
```

### 使用例の提供

- 複雑なコンポーネントには使用例を提供する
- 可能であればStorybook等のドキュメントツールを活用する

````tsx
/**
 * 使用例:
 *
 * ```tsx
 * <BookShelfHeader
 *   name="技術書コレクション"
 *   description="プログラミングや技術関連の本をまとめた本棚です。"
 *   variant="card"
 *   onEdit={() => console.log('編集')}
 *   onDelete={() => console.log('削除')}
 * />
 * ```
 */
````

## 7. テストの原則

### コンポーネントのテスト

- UIコンポーネントはレンダリングテストを行う
- ロジックはユニットテストを行う

```tsx
// UIコンポーネントのテスト例
describe('BookShelfHeader', () => {
    it('正しくレンダリングされる', () => {
        render(
            <BookShelfHeader
                name="テスト本棚"
                description="テスト説明"
                onEdit={() => {}}
                onDelete={() => {}}
            />,
        );

        expect(screen.getByText('テスト本棚')).toBeInTheDocument();
        expect(screen.getByText('テスト説明')).toBeInTheDocument();
    });

    it('編集ボタンがクリックされるとonEditが呼ばれる', () => {
        const onEdit = jest.fn();
        render(
            <BookShelfHeader
                name="テスト本棚"
                description="テスト説明"
                onEdit={onEdit}
                onDelete={() => {}}
            />,
        );

        fireEvent.click(screen.getByRole('button', { name: /編集/i }));
        expect(onEdit).toHaveBeenCalled();
    });
});

// ロジックのテスト例
describe('useBookShelfState', () => {
    it('初期状態が正しい', () => {
        const { result } = renderHook(() => useBookShelfState());

        expect(result.current.dialogs.edit.isOpen).toBe(false);
        expect(result.current.dialogs.delete.isOpen).toBe(false);
    });

    it('openメソッドが状態を更新する', () => {
        const { result } = renderHook(() => useBookShelfState());

        act(() => {
            result.current.dialogs.edit.open();
        });

        expect(result.current.dialogs.edit.isOpen).toBe(true);
    });
});
```

## 8. パフォーマンスの最適化

### メモ化の活用

- 不必要な再レンダリングを防ぐためにメモ化を活用する
- `React.memo`、`useMemo`、`useCallback`を適切に使用する

```tsx
// 良い例: メモ化の活用
const MemoizedBookShelfHeader = React.memo(function BookShelfHeader({
  name,
  description,
  onEdit,
  onDelete,
}: BookShelfHeaderProps) {
  return (
    // JSX...
  );
});

function ParentComponent({ bookShelfId }: { bookShelfId: number }) {
  // コールバック関数をメモ化
  const handleEdit = useCallback(() => {
    // 編集ロジック
  }, [bookShelfId]);

  const handleDelete = useCallback(() => {
    // 削除ロジック
  }, [bookShelfId]);

  // 計算結果をメモ化
  const formattedData = useMemo(() => {
    // 複雑な計算
    return { /* ... */ };
  }, [/* 依存配列 */]);

  return (
    <MemoizedBookShelfHeader
      name={formattedData.name}
      description={formattedData.description}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
```

### レンダリングの最適化

- 大きなリストには仮想化を使用する
- 条件付きレンダリングを活用する

```tsx
// 良い例: 条件付きレンダリング
function BookShelfList({ bookShelves, isLoading, error }: BookShelfListProps) {
    if (isLoading) return <LoadingSpinner />;
    if (error) return <ErrorMessage error={error} />;
    if (bookShelves.length === 0) return <EmptyState />;

    return (
        <div>
            {bookShelves.map((bookShelf) => (
                <BookShelfCard key={bookShelf.id} {...bookShelf} />
            ))}
        </div>
    );
}
```

## まとめ

このコーディングガイドに従うことで、以下の利点が得られます：

1. **コードの一貫性**: すべての開発者が同じ規則に従うことで、コードベース全体の一貫性が保たれます
2. **保守性の向上**: 明確な構造と責任の分離により、コードの保守が容易になります
3. **再利用性の向上**: 小さく独立したコンポーネントとフックが再利用可能になります
4. **品質の向上**: テストやドキュメント化の原則に従うことで、コードの品質が向上します

新しいコンポーネントやファイルを追加する際は、このガイドを参照して、プロジェクト全体の品質と一貫性を維持してください。
