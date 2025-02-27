# BookCardUI リファクタリング実装例

リファクタリング計画に基づいた主要コンポーネントとフックの実装例です。

## 1. APIコールの整理 (bookService.ts)

```typescript
// resources/ts/Services/bookService.ts
import axios from 'axios';
import { BookBaseProps, ReadStatus } from '@/types';

export const BookService = {
    // 既存のメソッド
    getFavoriteStatus: (isbn: string) =>
        axios.get<{ isFavorite: boolean }>('/books/favorite-status', {
            params: { isbn },
        }),

    toggleFavorite: (bookData: BookBaseProps) =>
        axios.post('/books/toggle-favorite', bookData),

    updateReadStatus: (isbn: string, readStatus: ReadStatus) =>
        axios.post('/books/update-status', { isbn, readStatus }),

    fetchBookshelves: () =>
        axios.get<{ id: number; book_shelf_name: string }[]>(
            '/book-shelf/get/mylist',
        ),

    addToBookshelf: (shelfId: number, isbn: string) =>
        axios.post('/book-shelf/add/books', {
            book_shelf_id: shelfId,
            isbns: [isbn],
        }),

    createBookshelf: (name: string, description: string) =>
        axios.post('/book-shelf/create', {
            book_shelf_name: name,
            description,
        }),

    removeFromBookshelf: (shelfId: number, isbn: string) =>
        axios.post('/book-shelf/remove-book', { book_shelf_id: shelfId, isbn }),

    // 新しく追加するメソッド
    createMemo: (data: {
        isbn: string;
        memo: string;
        memo_chapter?: number;
        memo_page?: number;
    }) => axios.post('/memo/create', data),
};
```

## 2. 型定義の改善

```typescript
// resources/ts/types/book.ts
export type ReadStatus = 'want_read' | 'reading' | 'read';

export interface BookBaseProps {
    isbn: string;
    title: string;
    author: string;
    publisher_name: string;
    sales_date: string;
    item_price: number;
    image_url: string;
    item_caption: string;
}

export interface BookCardBaseProps extends BookBaseProps {
    children?: React.ReactNode;
}

export interface DefaultBookCardProps extends BookBaseProps {}

export interface FavoriteBookCardProps extends BookBaseProps {
    readStatus: ReadStatus;
}

export interface BookShelfBookCardProps extends BookBaseProps {
    readStatus: ReadStatus;
    book_shelf_id: number;
}
```

## 3. カスタムフックの実装

### useBookCardState.ts

```typescript
// resources/ts/Components/Book/BookCard/hooks/useBookCardState.ts
import { useState } from 'react';
import { ReadStatus } from '@/types/book';

export function useBookCardState(initialReadStatus?: ReadStatus) {
    const [detailBookDialogOpen, setDetailBookDialogOpen] = useState(false);
    const [readStatusDialogOpen, setReadStatusDialogOpen] = useState(false);
    const [createBookShelfDialogOpen, setCreateBookShelfDialogOpen] =
        useState(false);
    const [deleteBookDialogOpen, setDeleteBookDialogOpen] = useState(false);
    const [createMemoDialogOpen, setCreateMemoDialogOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<ReadStatus>(
        initialReadStatus ?? 'want_read',
    );

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
            },
            createBookShelf: {
                isOpen: createBookShelfDialogOpen,
                open: () => setCreateBookShelfDialogOpen(true),
                close: () => setCreateBookShelfDialogOpen(false),
            },
            deleteBook: {
                isOpen: deleteBookDialogOpen,
                open: () => setDeleteBookDialogOpen(true),
                close: () => setDeleteBookDialogOpen(false),
            },
            createMemo: {
                isOpen: createMemoDialogOpen,
                open: () => setCreateMemoDialogOpen(true),
                close: () => setCreateMemoDialogOpen(false),
            },
        },
        readStatus: {
            status: selectedStatus,
            setStatus: setSelectedStatus,
        },
    };
}
```

### useFavoriteBook.ts

```typescript
// resources/ts/Components/Book/BookCard/hooks/useFavoriteBook.ts
import { useEffect, useState } from 'react';
import { BookService } from '@/Services/bookService';
import { BookBaseProps } from '@/types/book';

export function useFavoriteBook(book: BookBaseProps) {
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        BookService.getFavoriteStatus(book.isbn)
            .then((response) => setIsFavorite(response.data.isFavorite))
            .catch((error) =>
                console.error('Failed to get favorite status:', error),
            );
    }, [book.isbn]);

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
        BookService.toggleFavorite(book).catch((error) => {
            console.error('Failed to toggle favorite:', error);
            setIsFavorite(isFavorite); // Revert on error
        });
    };

    return {
        isFavorite,
        toggleFavorite,
    };
}
```

### useBookShelf.ts

```typescript
// resources/ts/Components/Book/BookCard/hooks/useBookShelf.ts
import { useEffect, useState } from 'react';
import { BookService } from '@/Services/bookService';
import { router } from '@inertiajs/react';

export function useBookShelf() {
    const [bookshelves, setBookshelves] = useState<
        { id: number; book_shelf_name: string }[]
    >([]);

    const fetchBookshelves = () => {
        BookService.fetchBookshelves()
            .then((response) => setBookshelves(response.data))
            .catch((error) =>
                console.error('Failed to fetch bookshelves:', error),
            );
    };

    useEffect(() => {
        fetchBookshelves();
    }, []);

    const addToBookshelf = (shelfId: number, isbn: string) => {
        BookService.addToBookshelf(shelfId, isbn).catch((error) =>
            console.error('Failed to add book to shelf:', error),
        );
    };

    const createBookshelf = async (name: string, description: string) => {
        try {
            await BookService.createBookshelf(name, description);
            fetchBookshelves(); // 本棚リストを再取得
            return true;
        } catch (error) {
            console.error('Failed to create bookshelf:', error);
            return false;
        }
    };

    const removeFromBookshelf = async (shelfId: number, isbn: string) => {
        try {
            await BookService.removeFromBookshelf(shelfId, isbn);
            router.reload();
            return true;
        } catch (error) {
            console.error('Failed to remove book from shelf:', error);
            return false;
        }
    };

    return {
        bookshelves,
        addToBookshelf,
        createBookshelf,
        removeFromBookshelf,
    };
}
```

### useBookMemo.ts

```typescript
// resources/ts/Components/Book/BookCard/hooks/useBookMemo.ts
import { BookService } from '@/Services/bookService';
import { router } from '@inertiajs/react';

export function useBookMemo() {
    const createMemo = async (
        isbn: string,
        memo: string,
        chapter?: number,
        page?: number,
    ) => {
        try {
            await BookService.createMemo({
                isbn,
                memo,
                memo_chapter: chapter,
                memo_page: page,
            });
            router.reload();
            return true;
        } catch (error) {
            console.error('Failed to create memo:', error);
            return false;
        }
    };

    return {
        createMemo,
    };
}
```

## 4. 共通UIコンポーネント

### BookCardImage.tsx

```typescript
// resources/ts/Components/Book/BookCard/BookCardImage.tsx
import React from 'react';

interface BookCardImageProps {
  imageUrl: string;
  title: string;
  variant?: 'favorite' | 'default' | 'book-shelf';
}

export function BookCardImage({ imageUrl, title, variant = 'default' }: BookCardImageProps) {
  return (
    <div
      className={`mx-auto aspect-[3/4] w-full max-w-[200px] overflow-hidden rounded-md border-2 border-gray-200 shadow-lg ${
        variant === 'favorite' || variant === 'book-shelf' ? '' : 'shrink-0'
      }`}
    >
      <img
        src={imageUrl || '/placeholder.svg'}
        alt={title}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
```

### BookCardHeader.tsx

```typescript
// resources/ts/Components/Book/BookCard/BookCardHeader.tsx
import React from 'react';

interface BookCardHeaderProps {
  title: string;
  author: string;
  publisherName: string;
  salesDate: string;
  itemPrice?: number;
  variant?: 'favorite' | 'default' | 'book-shelf';
}

export function BookCardHeader({
  title,
  author,
  publisherName,
  salesDate,
  itemPrice,
  variant = 'default',
}: BookCardHeaderProps) {
  return (
    <div className="space-y-2">
      <div className="flex">
        <h2
          className={`${
            variant === 'favorite' || variant === 'book-shelf'
              ? 'text-xl font-bold sm:text-2xl'
              : 'w-full truncate text-xl font-bold sm:text-left sm:text-2xl'
          }`}
        >
          {title}
        </h2>
        <div
          className={`${
            variant === 'favorite' || variant === 'book-shelf' ? 'hidden md:block md:w-28' : ''
          }`}
        ></div>
      </div>
      <div
        className={`text-sm text-muted-foreground ${
          variant === 'favorite' || variant === 'book-shelf'
            ? 'space-y-1'
            : 'space-y-1 sm:text-left'
        }`}
      >
        <p className={variant === 'default' ? 'w-full truncate' : ''}>
          {`${salesDate} / ${author} / ${publisherName}`}
        </p>
        {variant === 'default' && itemPrice && (
          <p className="text-lg font-semibold text-red-600">
            ¥{itemPrice.toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
```

## 5. バリアント別コンポーネント

### BaseBookCard.tsx

```typescript
// resources/ts/Components/Book/BookCard/BaseBookCard.tsx
import React from 'react';
import { Card } from '@/Components/ui/card';
import { BookCardBaseProps } from '@/types/book';

interface BaseBookCardProps extends BookCardBaseProps {
  variant?: 'favorite' | 'default' | 'book-shelf';
  children: React.ReactNode;
}

export function BaseBookCard({
  variant = 'default',
  children,
}: BaseBookCardProps) {
  return (
    <Card
      className={`mx-auto w-full ${
        variant === 'favorite' || variant === 'book-shelf'
          ? 'p-4'
          : 'max-w-4xl overflow-hidden p-4 md:p-6'
      }`}
    >
      <div
        className={
          variant === 'favorite' || variant === 'book-shelf'
            ? 'relative grid gap-4 sm:grid-cols-[200px_1fr]'
            : 'flex flex-col gap-4 md:flex-row lg:flex-col'
        }
      >
        {children}
      </div>
    </Card>
  );
}
```

### DefaultBookCard.tsx (例)

```typescript
// resources/ts/Components/Book/BookCard/DefaultBookCard.tsx
import React from 'react';
import { Button } from '@/Components/ui/button';
import { BookDetailDialog } from '@/Dialog/Book/BookDetailDialog';
import { DefaultBookCardProps } from '@/types/book';
import { BaseBookCard } from './BaseBookCard';
import { BookCardImage } from './BookCardImage';
import { BookCardHeader } from './BookCardHeader';
import { useBookCardState } from './hooks/useBookCardState';
import { useFavoriteBook } from './hooks/useFavoriteBook';
import FavoriteIcon from '@/Components/Icon/FavoriteIcon';

export function DefaultBookCard(props: DefaultBookCardProps) {
  const {
    title,
    author,
    publisher_name,
    sales_date,
    item_price,
    isbn,
    image_url,
    item_caption,
  } = props;

  const { dialogs } = useBookCardState();
  const { isFavorite, toggleFavorite } = useFavoriteBook(props);

  return (
    <BaseBookCard variant="default" {...props}>
      <BookCardImage
        imageUrl={image_url}
        title={title}
        variant="default"
      />

      <div className="flex flex-col justify-between flex-1 space-y-4">
        <BookCardHeader
          title={title}
          author={author}
          publisherName={publisher_name}
          salesDate={sales_date}
          itemPrice={item_price}
          variant="default"
        />

        <div className="flex items-center gap-2">
          <Button onClick={dialogs.detailBook.open} className="w-full">
            詳細を見る
          </Button>
          <FavoriteIcon
            isFavorite={isFavorite}
            onClick={toggleFavorite}
          />
        </div>
      </div>

      <BookDetailDialog
        title={title}
        author={author}
        publisher_name={publisher_name}
        sales_date={sales_date}
        item_price={item_price}
        isbn={isbn}
        image_url={image_url}
        isOpen={dialogs.detailBook.isOpen}
        onClose={dialogs.detailBook.close}
        onConfirm={dialogs.detailBook.close}
        item_caption={item_caption}
      />
    </BaseBookCard>
  );
}
```

## 6. エントリーポイント

```typescript
// resources/ts/Components/Book/BookCard/index.tsx
import React from 'react';
import { DefaultBookCard } from './DefaultBookCard';
import { FavoriteBookCard } from './FavoriteBookCard';
import { BookShelfBookCard } from './BookShelfBookCard';
import { BookBaseProps, BookShelfBookCardProps, FavoriteBookCardProps } from '@/types/book';

interface BookCardProps extends BookBaseProps {
  variant?: 'favorite' | 'default' | 'book-shelf';
  readStatus?: FavoriteBookCardProps['readStatus'];
  book_shelf_id?: BookShelfBookCardProps['book_shelf_id'];
}

export default function BookCard(props: BookCardProps) {
  const { variant = 'default' } = props;

  if (variant === 'favorite') {
    if (!props.readStatus) {
      console.error('readStatus is required for favorite variant');
      return null;
    }
    return <FavoriteBookCard {...props} readStatus={props.readStatus} />;
  }

  if (variant === 'book-shelf') {
    if (!props.readStatus || !props.book_shelf_id) {
      console.error('readStatus and book_shelf_id are required for book-shelf variant');
      return null;
    }
    return (
      <BookShelfBookCard
        {...props}
        readStatus={props.readStatus}
        book_shelf_id={props.book_shelf_id}
      />
    );
  }

  return <DefaultBookCard {...props} />;
}
```

## 実装の注意点

1. 上記は主要なコンポーネントとフックの実装例です。実際の実装では、他のバリアント（`FavoriteBookCard.tsx`、`BookShelfBookCard.tsx`）も同様に実装する必要があります。

2. 型定義は`@/types/book.ts`などに分離することで、型の再利用性を高めています。

3. 各コンポーネントは単一責任の原則に従い、明確な役割を持っています。

4. カスタムフックによって状態管理とビジネスロジックをUIから分離しています。

5. エントリーポイントとなる`index.tsx`では、適切なバリアントを選択するロジックを実装しています。
