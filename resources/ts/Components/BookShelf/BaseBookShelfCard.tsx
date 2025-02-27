import React from 'react';
import { Card } from '@/Components/ui/card';
import { BookShelfBase } from '@/types/bookShelf';

interface BaseBookShelfCardProps extends BookShelfBase {
  variant?: 'card' | 'description';
  children: React.ReactNode;
}

/**
 * 基本的なカードレイアウトを提供するコンポーネント
 * 子コンポーネントをスロットとして受け取る設計
 */
export function BaseBookShelfCard({
  variant = 'card',
  children,
}: BaseBookShelfCardProps) {
  return (
    <Card
      className={`mx-auto w-full ${variant === 'description'
          ? 'border border-green-600 shadow-md min-h-40 mt-4 px-4 py-2 md:py-4'
          : 'overflow-hidden'
        }`}
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
