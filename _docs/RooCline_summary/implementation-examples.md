# リファクタリング実装例

このドキュメントでは、リファクタリング計画に基づいた実装例を提供します。これらの例は、新しいディレクトリ構造とコーディングガイドに従って実装されています。

## 1. ディレクトリ構造の例

```
resources/ts/
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── book/
│   │   └── card/
│   │       ├── BaseCard.tsx
│   │       ├── DefaultCard.tsx
│   │       └── index.tsx
│   └── bookshelf/
│       ├── card/
│       │   ├── BaseCard.tsx
│       │   ├── DefaultCard.tsx
│       │   ├── DetailCard.tsx
│       │   └── index.tsx
│       ├── elements/
│       │   ├── Header.tsx
│       │   ├── Image.tsx
│       │   └── UserInfo.tsx
│       └── index.tsx
├── features/
│   ├── book/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── pages/
│   └── bookshelf/
│       ├── components/
│       │   └── dialogs/
│       │       ├── AddBookDialog.tsx
│       │       ├── CreateDialog.tsx
│       │       ├── DeleteDialog.tsx
│       │       ├── EditDialog.tsx
│       │       └── index.tsx
│       ├── hooks/
│       │   ├── useBookShelfDialogs.ts
│       │   ├── useBookShelfMutation.ts
│       │   └── useBookShelfQuery.ts
│       └── pages/
│           ├── BookShelfDetailPage.tsx
│           └── BookShelfListPage.tsx
├── services/
│   ├── apiClient.ts
│   ├── bookService.ts
│   └── bookShelfService.ts
├── hooks/
│   ├── useDialog.ts
│   └── usePagination.ts
└── types/
    ├── book.ts
    └── bookShelf.ts
```

## 2. UIコンポーネントの実装例

### BaseCard.tsx

```tsx
import React from 'react';
import { Card } from '@/components/common/ui/card';

interface BaseCardProps {
    variant?: 'card' | 'description';
    children: React.ReactNode;
    className?: string;
}

/**
 * 基本的なカードレイアウトを提供するコンポーネント
 * 子コンポーネントをスロットとして受け取る設計
 */
export function BaseCard({
    variant = 'card',
    children,
    className = '',
}: BaseCardProps) {
    return (
        <Card
            className={`mx-auto w-full ${
                variant === 'description'
                    ? 'mt-4 min-h-40 border border-green-600 px-4 py-2 shadow-md md:py-4'
                    : 'overflow-hidden'
            } ${className}`}
        >
            <div
                className={
                    variant === 'description'
                        ? 'flex flex-col gap-4'
                        : 'p-4 md:p-6'
                }
            >
                {children}
            </div>
        </Card>
    );
}
```

### Header.tsx

```tsx
import React from 'react';
import { CardTitle, CardDescription } from '@/components/common/ui/card';
import { BookShelfActions, ExtendedBookShelfActions } from './Actions';

interface HeaderProps {
    name: string;
    description: string;
    variant?: 'card' | 'description';
    onEdit: () => void;
    onDelete: () => void;
    onAddBook?: () => void;
}

/**
 * 本棚のタイトルと説明を表示するコンポーネント
 */
export function Header({
    name,
    description,
    variant = 'card',
    onEdit,
    onDelete,
    onAddBook,
}: HeaderProps) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between">
                <CardTitle
                    className={`${
                        variant === 'description'
                            ? 'text-2xl font-bold'
                            : 'text-xl font-bold'
                    }`}
                >
                    {name}
                </CardTitle>

                {variant === 'description' && onAddBook ? (
                    <ExtendedBookShelfActions
                        onAddBook={onAddBook}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ) : (
                    <BookShelfActions onEdit={onEdit} onDelete={onDelete} />
                )}
            </div>

            <CardDescription
                className={`${
                    variant === 'description'
                        ? 'text-md mt-1 text-gray-700'
                        : 'text-sm text-gray-600'
                }`}
            >
                {description}
            </CardDescription>
        </div>
    );
}
```

### DefaultCard.tsx

```tsx
import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/common/ui/button';
import { BookShelfBase } from '@/types/bookShelf';
import { BaseCard } from './BaseCard';
import { Image } from '../elements/Image';
import { Header } from '../elements/Header';

interface DefaultCardProps extends BookShelfBase {
    image?: string;
    onEdit: () => void;
    onDelete: () => void;
}

/**
 * デフォルトバリアントの本棚カードコンポーネント
 */
export function DefaultCard({
    bookShelfId,
    name,
    description,
    isPublic,
    image,
    onEdit,
    onDelete,
}: DefaultCardProps) {
    return (
        <BaseCard variant="card">
            <div className="flex flex-row gap-4">
                <Image imageUrl={image || ''} name={name} variant="card" />

                <div className="flex flex-1 flex-col">
                    <Header
                        name={name}
                        description={description}
                        variant="card"
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />

                    <Link href={`/book-shelf/${bookShelfId}`}>
                        <Button className="mt-4 text-sm">詳細を見る</Button>
                    </Link>
                </div>
            </div>
        </BaseCard>
    );
}
```

## 3. カスタムフックの実装例

### useBookShelfDialogs.ts

```tsx
import { useState } from 'react';
import { useBookShelfMutation } from './useBookShelfMutation';

/**
 * 本棚関連のダイアログ状態を管理するカスタムフック
 */
export function useBookShelfDialogs(
    bookShelfId: number,
    includeAddBook = false,
) {
    // ダイアログの開閉状態
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isAddBookOpen, setIsAddBookOpen] = useState(false);

    const { updateBookShelf, deleteBookShelf, addBooksToShelf } =
        useBookShelfMutation();

    const handleEdit = async (
        name: string,
        description: string,
        isPublic: boolean,
    ) => {
        const success = await updateBookShelf(bookShelfId, {
            name,
            description,
            isPublic,
        });

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

    const handleAddBook = async (selectedIsbns: string[]) => {
        if (!includeAddBook) return;

        const success = await addBooksToShelf(bookShelfId, selectedIsbns);

        if (success) {
            setIsAddBookOpen(false);
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
            ...(includeAddBook
                ? {
                      addBook: {
                          isOpen: isAddBookOpen,
                          open: () => setIsAddBookOpen(true),
                          close: () => setIsAddBookOpen(false),
                          handle: handleAddBook,
                      },
                  }
                : {}),
        },
    };
}
```

### useBookShelfMutation.ts

```tsx
import { useState } from 'react';
import { bookShelfService } from '@/services/bookShelfService';
import { UpdateBookShelfData } from '@/types/bookShelf';

/**
 * 本棚の変更操作を管理するカスタムフック
 */
export function useBookShelfMutation() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateBookShelf = async (
        bookShelfId: number,
        data: UpdateBookShelfData,
    ): Promise<boolean> => {
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

    const deleteBookShelf = async (bookShelfId: number): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        const result = await bookShelfService.delete(bookShelfId);

        setIsLoading(false);

        if (!result.success) {
            setError(result.error);
            return false;
        }

        return true;
    };

    const addBooksToShelf = async (
        bookShelfId: number,
        isbns: string[],
    ): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        const result = await bookShelfService.addBooks(bookShelfId, isbns);

        setIsLoading(false);

        if (!result.success) {
            setError(result.error);
            return false;
        }

        return true;
    };

    return {
        updateBookShelf,
        deleteBookShelf,
        addBooksToShelf,
        isLoading,
        error,
    };
}
```

## 4. コンテナコンポーネントの実装例

### BookShelfContainer.tsx

```tsx
import React from 'react';
import { BookShelfBase } from '@/types/bookShelf';
import { DefaultCard } from '@/components/bookshelf/card/DefaultCard';
import { DetailCard } from '@/components/bookshelf/card/DetailCard';
import { useBookShelfDialogs } from '../hooks/useBookShelfDialogs';
import { BookShelfDialogs } from './dialogs';

interface BookShelfContainerProps extends BookShelfBase {
    variant?: 'card' | 'description';
    image?: string;
    userName?: string;
    userImage?: string;
}

/**
 * 本棚コンポーネントのコンテナ
 * 状態管理とロジックを担当
 */
export function BookShelfContainer(props: BookShelfContainerProps) {
    const { bookShelfId, variant = 'card' } = props;
    const includeAddBook = variant === 'description';
    const { dialogs } = useBookShelfDialogs(bookShelfId, includeAddBook);

    // 詳細バリアント
    if (variant === 'description') {
        return (
            <>
                <DetailCard
                    {...props}
                    onEdit={dialogs.edit.open}
                    onDelete={dialogs.delete.open}
                    onAddBook={dialogs.addBook?.open}
                />

                <BookShelfDialogs
                    bookShelfId={bookShelfId}
                    initialName={props.name}
                    initialDescription={props.description}
                    initialIsPublic={props.isPublic}
                    dialogStates={{
                        edit: dialogs.edit.isOpen,
                        delete: dialogs.delete.isOpen,
                        addBook: dialogs.addBook?.isOpen,
                    }}
                    onDialogStateChange={(dialogKey, isOpen) => {
                        if (dialogKey === 'edit') {
                            isOpen ? dialogs.edit.open() : dialogs.edit.close();
                        } else if (dialogKey === 'delete') {
                            isOpen
                                ? dialogs.delete.open()
                                : dialogs.delete.close();
                        } else if (dialogKey === 'addBook' && dialogs.addBook) {
                            isOpen
                                ? dialogs.addBook.open()
                                : dialogs.addBook.close();
                        }
                    }}
                    onEditConfirm={dialogs.edit.handle}
                    onDeleteConfirm={dialogs.delete.handle}
                    onAddBookConfirm={dialogs.addBook?.handle}
                />
            </>
        );
    }

    // デフォルトバリアント（カード）
    return (
        <>
            <DefaultCard
                {...props}
                onEdit={dialogs.edit.open}
                onDelete={dialogs.delete.open}
            />

            <BookShelfDialogs
                bookShelfId={bookShelfId}
                initialName={props.name}
                initialDescription={props.description}
                initialIsPublic={props.isPublic}
                dialogStates={{
                    edit: dialogs.edit.isOpen,
                    delete: dialogs.delete.isOpen,
                }}
                onDialogStateChange={(dialogKey, isOpen) => {
                    if (dialogKey === 'edit') {
                        isOpen ? dialogs.edit.open() : dialogs.edit.close();
                    } else if (dialogKey === 'delete') {
                        isOpen ? dialogs.delete.open() : dialogs.delete.close();
                    }
                }}
                onEditConfirm={dialogs.edit.handle}
                onDeleteConfirm={dialogs.delete.handle}
            />
        </>
    );
}
```

## 5. サービスの実装例

### bookShelfService.ts

```tsx
import axios, { AxiosError } from 'axios';
import { router } from '@inertiajs/react';
import { BookShelf, UpdateBookShelfData, Result } from '@/types/bookShelf';

// API エンドポイント定義
const API_ENDPOINTS = {
    UPDATE: (id: number) => `/book-shelf/update/${id}`,
    DELETE: (id: number) => `/book-shelf/delete/${id}`,
    ADD_BOOKS: '/book-shelf/add/books',
} as const;

// エラーハンドリング用の共通関数
const handleApiError = (error: unknown, errorMessage: string): string => {
    if (error instanceof AxiosError) {
        return `${errorMessage}: ${error.response?.data?.message || error.message}`;
    }
    return `${errorMessage}: 予期せぬエラーが発生しました`;
};

// BookShelf サービス
export const bookShelfService = {
    // BookShelf 更新
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

            router.reload();

            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            return {
                success: false,
                error: handleApiError(error, '本棚の更新に失敗しました'),
            };
        }
    },

    // BookShelf 削除
    delete: async (bookShelfId: number): Promise<Result<void>> => {
        try {
            await axios.delete(API_ENDPOINTS.DELETE(bookShelfId));

            router.visit('/');

            return {
                success: true,
            };
        } catch (error) {
            return {
                success: false,
                error: handleApiError(error, '本棚の削除に失敗しました'),
            };
        }
    },

    // 本の追加
    addBooks: async (
        bookShelfId: number,
        isbns: string[],
    ): Promise<Result<void>> => {
        try {
            await axios.post(API_ENDPOINTS.ADD_BOOKS, {
                book_shelf_id: bookShelfId,
                isbns,
            });

            router.reload();

            return {
                success: true,
            };
        } catch (error) {
            return {
                success: false,
                error: handleApiError(error, '本の追加に失敗しました'),
            };
        }
    },
};
```

## 6. 型定義の実装例

### bookShelf.ts

```tsx
// 基本的な結果型
export interface Result<T = void> {
    success: boolean;
    data?: T;
    error?: string;
}

// 本棚の基本情報
export interface BookShelfBase {
    bookShelfId: number;
    name: string;
    description: string;
    isPublic: boolean;
}

// 更新用データ型
export interface UpdateBookShelfData {
    name: string;
    description: string;
    isPublic: boolean;
}

// 本棚の完全な情報
export interface BookShelf extends BookShelfBase {
    image?: string;
    createdAt: string;
    updatedAt: string;
    userId: number;
}

// ダイアログの状態管理用
export interface BookShelfDialogStates {
    edit: boolean;
    delete: boolean;
    addBook?: boolean; // 本の追加ダイアログは一部のコンポーネントでのみ使用
}

// ユーザー情報
export interface UserInfo {
    userName: string;
    userImage: string;
}

// 本棚カード用のプロパティ
export interface BookShelfCardProps extends BookShelfBase {
    image?: string;
    onEdit: () => void;
    onDelete: () => void;
}

// 本棚詳細用のプロパティ
export interface BookShelfDetailCardProps
    extends BookShelfBase,
        Partial<UserInfo> {
    onEdit: () => void;
    onDelete: () => void;
    onAddBook?: () => void;
}

// ドロップダウンメニューのアクション用
export interface BookShelfActionsProps {
    onEdit: () => void;
    onDelete: () => void;
}

// 拡張アクション（本の追加などを含む）
export interface ExtendedBookShelfActionsProps extends BookShelfActionsProps {
    onAddBook: () => void;
    onShare?: () => void;
}
```

## 7. エントリーポイントの実装例

### index.tsx

````tsx
import React from 'react';
import { BookShelfBase } from '@/types/bookShelf';
import { BookShelfContainer } from '@/features/bookshelf/components/BookShelfContainer';

interface BookShelfProps extends BookShelfBase {
    variant?: 'card' | 'description';
    image?: string;
    userName?: string;
    userImage?: string;
}

/**
 * 本棚コンポーネントのエントリーポイント
 *
 * 使用例:
 * ```tsx
 * <BookShelf
 *   bookShelfId={1}
 *   name="技術書コレクション"
 *   description="プログラミングや技術関連の本をまとめた本棚です。"
 *   isPublic={true}
 *   image="https://example.com/image.jpg"
 *   variant="card"
 * />
 * ```
 */
export default function BookShelf(props: BookShelfProps) {
    return <BookShelfContainer {...props} />;
}

// 各コンポーネントをエクスポート（必要に応じて）
export { BaseCard } from './card/BaseCard';
export { DefaultCard } from './card/DefaultCard';
export { DetailCard } from './card/DetailCard';
export { Header } from './elements/Header';
export { Image } from './elements/Image';
````

これらの実装例は、リファクタリング計画に基づいて作成されています。実際の実装では、プロジェクトの要件や既存のコードベースに合わせて調整が必要になる場合があります。
