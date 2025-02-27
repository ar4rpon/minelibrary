import { Card } from '@/components/common/ui/card';
import { BookShelfBase } from '@/types/bookShelf';
import React from 'react';

interface BaseCardProps extends BookShelfBase {
  variant?: 'card' | 'description';
  children: React.ReactNode;
}

/**
 * 基本的なカードレイアウトを提供するコンポーネント
 * 子コンポーネントをスロットとして受け取る設計
 */
export function BaseCard({ variant = 'card', children }: BaseCardProps) {
  return (
    <Card
      className={`mx-auto w-full ${
        variant === 'description'
          ? 'mt-4 min-h-40 border border-green-600 px-4 py-2 shadow-md md:py-4'
          : 'overflow-hidden'
      }`}
    >
      <div
        className={
          variant === 'description' ? 'flex flex-col gap-4' : 'p-4 md:p-6'
        }
      >
        {children}
      </div>
    </Card>
  );
}
