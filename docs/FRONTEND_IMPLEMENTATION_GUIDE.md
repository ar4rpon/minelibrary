# フロントエンド実装ガイドライン

## 🎯 リファクタリング実装手順

### Phase 1: 基盤コンポーネントの統一 (優先度: 高)

#### Step 1.1: 統一BaseCardの実装

**実装ファイル**: `resources/ts/components/common/BaseCard.tsx`

```typescript
import { Card } from '@/components/common/ui/card';
import { cn } from '@/lib/utils';
import React from 'react';

type CardVariant = 
  | 'book-default' 
  | 'book-favorite' 
  | 'book-shelf' 
  | 'bookshelf-card' 
  | 'bookshelf-description'
  | 'memo-card';

interface BaseCardProps {
  variant?: CardVariant;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export function BaseCard({ 
  variant = 'book-default', 
  className,
  children, 
  onClick 
}: BaseCardProps) {
  const cardStyles = {
    'book-default': 'mx-auto w-full max-w-4xl overflow-hidden p-4 md:p-6',
    'book-favorite': 'mx-auto w-full p-4',
    'book-shelf': 'mx-auto w-full p-4',
    'bookshelf-card': 'mx-auto w-full overflow-hidden',
    'bookshelf-description': 'mx-auto w-full mt-4 min-h-40 border border-green-600 px-4 py-2 shadow-md md:py-4',
    'memo-card': 'mx-auto w-full p-4 hover:shadow-md transition-shadow'
  };

  const contentStyles = {
    'book-default': 'flex flex-col gap-4 md:flex-row lg:flex-col',
    'book-favorite': 'relative grid gap-4 sm:grid-cols-[200px_1fr]',
    'book-shelf': 'relative grid gap-4 sm:grid-cols-[200px_1fr]',
    'bookshelf-card': 'p-4 md:p-6',
    'bookshelf-description': 'flex flex-col gap-4',
    'memo-card': 'flex flex-col gap-2'
  };

  return (
    <Card 
      className={cn(cardStyles[variant], className)}
      onClick={onClick}
    >
      <div className={contentStyles[variant]}>
        {children}
      </div>
    </Card>
  );
}
```

#### Step 1.2: 既存BaseCardの置き換え

**移行手順**:
1. 新しい統一BaseCardを作成
2. 各書所で import を変更
3. variant props を適切に設定
4. 古いBaseCardファイルを削除

**例: BookShelfCardの移行**
```typescript
// Before
import { BaseCard } from '../../card/BaseCard';

// After  
import { BaseCard } from '@/components/common/BaseCard';

<BaseCard variant="bookshelf-card">
  {/* 既存のchildren */}
</BaseCard>
```

### Phase 2: ダイアログ状態管理の統一 (優先度: 高)

#### Step 2.1: 共通ダイアログフックの実装

**実装ファイル**: `resources/ts/hooks/useDialogState.ts`

```typescript
import { useState, useCallback } from 'react';

export interface DialogControls {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export function useDialogState(initialState = false): DialogControls {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, open, close };
}

export function useMultipleDialogs<T extends readonly string[]>(
  dialogNames: T
): Record<T[number], DialogControls> {
  const [states, setStates] = useState<Record<string, boolean>>(
    dialogNames.reduce((acc, name) => ({ ...acc, [name]: false }), {})
  );

  const controls = {} as Record<T[number], DialogControls>;
  
  dialogNames.forEach(name => {
    controls[name] = {
      isOpen: states[name] || false,
      open: useCallback(() => {
        setStates(prev => ({ ...prev, [name]: true }));
      }, [name]),
      close: useCallback(() => {
        setStates(prev => ({ ...prev, [name]: false }));
      }, [name])
    };
  });

  return controls;
}
```

#### Step 2.2: 既存フックの移行

**useBookCardState.ts の移行例**:
```typescript
// Before
const [detailBookDialogOpen, setDetailBookDialogOpen] = useState(false);
const [readStatusDialogOpen, setReadStatusDialogOpen] = useState(false);

return {
  dialogs: {
    detailBook: {
      isOpen: detailBookDialogOpen,
      open: () => setDetailBookDialogOpen(true),
      close: () => setDetailBookDialogOpen(false),
    },
    readStatus: {
      isOpen: readStatusDialogOpen,
      open: () => setReadStatusDialogOpen(true),
      close: () => setReadStatusDialogOpen(false),
    }
  }
};

// After
import { useMultipleDialogs } from '@/hooks/useDialogState';

const DIALOG_NAMES = ['detailBook', 'readStatus', 'createBookShelf', 'deleteBook', 'createMemo'] as const;

export function useBookCardState(initialReadStatus?: ReadStatus) {
  const dialogs = useMultipleDialogs(DIALOG_NAMES);
  
  const [selectedStatus, setSelectedStatus] = useState<ReadStatus>(
    initialReadStatus ?? 'want_read'
  );

  return {
    dialogs,
    readStatus: {
      status: selectedStatus,
      setStatus: setSelectedStatus,
    },
  };
}
```

### Phase 3: APIエラーハンドリングの統一 (優先度: 高)

#### Step 3.1: エラーハンドラーの実装

**実装ファイル**: `resources/ts/lib/errorHandler.ts`

```typescript
import { AxiosError } from 'axios';

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ApiErrorHandler {
  static handle(error: unknown, context: string): never {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || error.message;
      const statusCode = error.response?.status;
      
      console.error(`${context}: ${message}`);
      throw new AppError(message, statusCode, error);
    }
    
    if (error instanceof Error) {
      console.error(`${context}: ${error.message}`);
      throw new AppError(error.message, undefined, error);
    }
    
    console.error(`${context}: 予期せぬエラーが発生しました`);
    throw new AppError('予期せぬエラーが発生しました', undefined, error);
  }

  static async executeWithErrorHandling<T>(
    asyncFn: () => Promise<T>,
    context: string
  ): Promise<T> {
    try {
      return await asyncFn();
    } catch (error) {
      this.handle(error, context);
    }
  }
}
```

#### Step 3.2: 非同期状態管理フックの実装

**実装ファイル**: `resources/ts/hooks/useAsyncState.ts`

```typescript
import { useState, useCallback } from 'react';
import { AppError } from '@/lib/errorHandler';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useAsyncState<T>() {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const execute = useCallback(async (asyncFn: () => Promise<T>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await asyncFn();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage = error instanceof AppError 
        ? error.message 
        : '予期せぬエラーが発生しました';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset
  };
}
```

### Phase 4: 型定義の整理 (優先度: 中)

#### Step 4.1: ドメイン型の統一

**実装ファイル**: `resources/ts/types/domain/book.ts`

```typescript
export interface Book {
  isbn: string;
  title: string;
  author: string;
  publisher_name: string;
  sales_date: string;
  image_url: string;
  item_caption: string;
  item_price: number;
}

export interface BookWithStatus extends Book {
  read_status?: ReadStatus;
  isFavorite?: boolean;
}

export interface BookCardProps {
  book: BookWithStatus;
  onFavoriteToggle?: (isbn: string) => void;
  onStatusUpdate?: (isbn: string, status: ReadStatus) => void;
  variant?: 'default' | 'favorite' | 'shelf';
}
```

### Phase 5: ディレクトリ再編成 (優先度: 中)

#### Step 5.1: 段階的な移行

**移行順序**:
1. `hooks/` ディレクトリの作成と共通フックの移動
2. `components/common/` の整理
3. `components/domain/` の作成とドメイン固有コンポーネントの移動
4. `api/` ディレクトリの作成とAPIクライアントの整理

**例: Hooksの移行**
```bash
# 新しいディレクトリ構造
resources/ts/hooks/
├── common/
│   ├── useDialogState.ts
│   ├── useAsyncState.ts
│   └── useLocalStorage.ts
└── domain/
    ├── useBookCard.ts
    ├── useBookShelf.ts
    └── useMemo.ts
```

## 🔍 実装時のチェックリスト

### 品質チェック
- [ ] TypeScript エラーが0件
- [ ] ESLint エラーが0件  
- [ ] 既存テストが全て通過
- [ ] 新しいコンポーネントのテスト作成

### パフォーマンスチェック
- [ ] React DevTools でre-render回数確認
- [ ] Bundle Analyzer でサイズ確認
- [ ] Lighthouse スコア確認

### 互換性チェック  
- [ ] 既存の機能が正常動作
- [ ] Props インターフェースの後方互換性
- [ ] Import パスの更新完了

## 🚀 リリース戦略

### 段階的リリース
1. **Week 1-2**: Phase 1 (BaseCard統一)
2. **Week 3**: Phase 2 (ダイアログ管理統一)  
3. **Week 4**: Phase 3 (エラーハンドリング統一)
4. **Week 5-6**: Phase 4-5 (型定義・ディレクトリ整理)

### リスク軽減策
- 各Phaseでのテスト実施
- 段階的なコードレビュー
- 機能フラグによる部分的なロールバック対応
- パフォーマンス監視

## 📚 参考リソース

- [React Patterns](https://reactpatterns.com/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)

---

*このガイドラインは実装進行に合わせて継続的に更新されます。*