import { BookShelfBase } from '@/types/bookShelf';
import { DefaultCard } from './card/DefaultCard';
import { DetailCard } from './card/DetailCard';

interface BookShelfProps extends BookShelfBase {
  variant?: 'card' | 'description';
  image?: string;
  userName?: string;
  userImage?: string;
}

/**
 * 本棚コンポーネントのエントリーポイント
 * variantに応じて適切なコンポーネントを返す
 */
export default function BookShelf(props: BookShelfProps) {
  const { variant = 'card' } = props;

  // 詳細バリアント
  if (variant === 'description') {
    return <DetailCard {...props} />;
  }

  // デフォルトバリアント（カード）
  return <DefaultCard {...props} />;
}

// 各コンポーネントをエクスポート
export { BaseCard } from './card/BaseCard';
export { DefaultCard } from './card/DefaultCard';
export { DetailCard } from './card/DetailCard';
export { Header } from './elements/Header';
export { Image } from './elements/Image';
export { UserInfo } from './elements/UserInfo';
