import type { BookData } from '@/types/api';
import { ReadStatus } from '@/types/domain/book';
import { BookShelfCard } from './BookShelfCard';
import { DefaultCard } from './DefaultCard';
import { FavoriteCard } from './FavoriteCard';

interface BookCardProps extends BookData {
  variant?: 'favorite' | 'default' | 'book-shelf' | 'shared';
  readStatus?: ReadStatus | null;
  book_shelf_id?: number;
}

/**
 * 書籍カードコンポーネントのエントリーポイント
 * variantに応じて適切なコンポーネントを返す
 */
export function BookCard(props: BookCardProps) {
  const { variant = 'default' } = props;

  // お気に入りバリアント
  if (variant === 'favorite') {
    if (!props.readStatus) {
      console.error('readStatus is required for favorite variant');
      return null;
    }
    return <FavoriteCard {...props} readStatus={props.readStatus} />;
  }

  // 本棚バリアント
  if (variant === 'book-shelf') {
    if (!props.readStatus || !props.book_shelf_id) {
      console.error(
        'readStatus and book_shelf_id are required for book-shelf variant',
      );
      return null;
    }
    return (
      <BookShelfCard
        {...props}
        readStatus={props.readStatus}
        book_shelf_id={props.book_shelf_id}
      />
    );
  }

  // 共有本棚バリアント
  if (variant === 'shared') {
    if (!props.book_shelf_id) {
      console.error('book_shelf_id is required for shared variant');
      return null;
    }
    // 共有バリアントでは読み取り専用の表示を行う
    return <DefaultCard {...props} />;
  }

  // デフォルトバリアント
  return <DefaultCard {...props} />;
}

// 各コンポーネントをエクスポート
export { BookShelfCard } from './BookShelfCard';
export { DefaultCard } from './DefaultCard';
export { Header } from './elements/Header';
export { Image } from './elements/Image';
export { FavoriteCard } from './FavoriteCard';
