import { BookShelfBase } from '@/types/bookShelf';
import BookShelfCard from './BookShelfCard';
import BookShelfDescription from './BookShelfDescription';

// BookShelfコンポーネントのバリアント
export enum BookShelfVariant {
  CARD = 'card',
  DESCRIPTION = 'description',
}

// ファクトリーの入力プロパティ
interface BookShelfFactoryProps extends BookShelfBase {
  variant: BookShelfVariant;
  // カードバリアント用のプロパティ
  image?: string;
  // 詳細バリアント用のプロパティ
  userName?: string;
  userImage?: string;
}

/**
 * BookShelfコンポーネントのファクトリー関数
 * バリアントに応じて適切なコンポーネントを返す
 */
export function createBookShelf({
  variant,
  bookShelfId,
  name,
  description,
  isPublic,
  image,
  userName,
  userImage,
}: BookShelfFactoryProps) {
  switch (variant) {
    case BookShelfVariant.CARD:
      return (
        <BookShelfCard
          bookShelfId={bookShelfId}
          name={name}
          description={description}
          isPublic={isPublic}
          image={image}
        />
      );
    case BookShelfVariant.DESCRIPTION:
      return (
        <BookShelfDescription
          bookShelfId={bookShelfId}
          name={name}
          description={description}
          isPublic={isPublic}
          userName={userName}
          userImage={userImage}
        />
      );
    default:
      throw new Error(`不明なバリアント: ${variant}`);
  }
}

/**
 * 使用例:
 *
 * // カードバリアント
 * const bookShelfCard = createBookShelf({
 *   variant: BookShelfVariant.CARD,
 *   bookShelfId: 1,
 *   name: '本棚名',
 *   description: '説明',
 *   isPublic: true,
 *   image: 'https://example.com/image.jpg'
 * });
 *
 * // 詳細バリアント
 * const bookShelfDescription = createBookShelf({
 *   variant: BookShelfVariant.DESCRIPTION,
 *   bookShelfId: 1,
 *   name: '本棚名',
 *   description: '説明',
 *   isPublic: true,
 *   userName: 'ユーザー名',
 *   userImage: 'https://example.com/user.jpg'
 * });
 */
