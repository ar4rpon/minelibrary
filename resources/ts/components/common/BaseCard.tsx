import { Card } from '@/components/common/ui/card';
import { cn } from '@/lib/utils';
import React from 'react';

/**
 * カードバリアント型定義
 */
type CardVariant =
  | 'book-default'
  | 'book-favorite'
  | 'book-shelf'
  | 'bookshelf-card'
  | 'bookshelf-description'
  | 'memo-card';

/**
 * BaseCard プロパティ
 */
interface BaseCardProps {
  variant?: CardVariant;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

/**
 * 統一BaseCardコンポーネント
 * 全ての種類のカードに対応する統一基盤
 */
export function BaseCard({
  variant = 'book-default',
  className,
  children,
  onClick,
}: BaseCardProps) {
  // バリアント別のカードスタイル
  const cardStyles = {
    'book-default': 'mx-auto w-full max-w-4xl overflow-hidden p-4 md:p-6',
    'book-favorite': 'mx-auto w-full p-4',
    'book-shelf': 'mx-auto w-full p-4',
    'bookshelf-card': 'mx-auto w-full overflow-hidden',
    'bookshelf-description':
      'mx-auto w-full mt-4 min-h-40 border border-green-600 px-4 py-2 shadow-md md:py-4',
    'memo-card': 'mx-auto w-full p-4 hover:shadow-md transition-shadow',
  };

  // バリアント別のコンテンツスタイル
  const contentStyles = {
    'book-default': 'flex flex-col gap-4 md:flex-row lg:flex-col',
    'book-favorite': 'relative grid gap-4 sm:grid-cols-[200px_1fr]',
    'book-shelf': 'relative grid gap-4 sm:grid-cols-[200px_1fr]',
    'bookshelf-card': 'p-4 md:p-6',
    'bookshelf-description': 'flex flex-col gap-4',
    'memo-card': 'flex flex-col gap-2',
  };

  return (
    <Card
      className={cn(cardStyles[variant], className)}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className={contentStyles[variant]}>{children}</div>
    </Card>
  );
}

// 便利な型エクスポート
export type { BaseCardProps, CardVariant };
