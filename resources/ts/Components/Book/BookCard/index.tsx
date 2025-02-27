import React from 'react';
import { DefaultBookCard } from './DefaultBookCard';
import { FavoriteBookCard } from './FavoriteBookCard';
import { BookShelfBookCard } from './BookShelfBookCard';
import { BookData } from '@/Services/bookService';
import { ReadStatus } from '@/types';

interface BookCardProps extends BookData {
  variant?: 'favorite' | 'default' | 'book-shelf';
  readStatus?: ReadStatus;
  book_shelf_id?: number;
}

/**
 * 書籍カードコンポーネントのエントリーポイント
 * variantに応じて適切なコンポーネントを返す
 */
export default function BookCard(props: BookCardProps) {
  const { variant = 'default' } = props;

  // お気に入りバリアント
  if (variant === 'favorite') {
    if (!props.readStatus) {
      console.error('readStatus is required for favorite variant');
      return null;
    }
    return <FavoriteBookCard {...props} readStatus={props.readStatus} />;
  }

  // 本棚バリアント
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

  // デフォルトバリアント
  return <DefaultBookCard {...props} />;
}
