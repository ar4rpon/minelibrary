import { Card } from '@/Components/ui/card';
import { BookData } from '@/Services/bookService';
import React from 'react';

interface BaseCardProps extends BookData {
  variant?: 'favorite' | 'default' | 'book-shelf';
  children: React.ReactNode;
}

/**
 * 基本的なカードレイアウトを提供するコンポーネント
 * 子コンポーネントをスロットとして受け取る設計
 */
export function BaseCard({ variant = 'default', children }: BaseCardProps) {
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
