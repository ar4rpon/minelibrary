import React from 'react';
import { BookShelfBase } from '@/types/bookShelf';
import { DefaultBookShelfCard } from './DefaultBookShelfCard';
import { BookShelfDescriptionCard } from './BookShelfDescriptionCard';

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
    return <BookShelfDescriptionCard {...props} />;
  }

  // デフォルトバリアント（カード）
  return <DefaultBookShelfCard {...props} />;
}

// 各コンポーネントをエクスポート
export { BaseBookShelfCard } from './BaseBookShelfCard';
export { DefaultBookShelfCard } from './DefaultBookShelfCard';
export { BookShelfDescriptionCard } from './BookShelfDescriptionCard';
export { BookShelfHeader } from './BookShelfHeader';
export { BookShelfImage } from './BookShelfImage';
