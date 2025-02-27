import React from 'react';

interface BookCardHeaderProps {
  title: string;
  author: string;
  publisherName: string;
  salesDate: string;
  itemPrice?: number;
  variant?: 'favorite' | 'default' | 'book-shelf';
}

/**
 * 書籍のタイトルと基本情報を表示するコンポーネント
 */
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
          className={`${variant === 'favorite' || variant === 'book-shelf'
              ? 'text-xl font-bold sm:text-2xl'
              : 'w-full truncate text-xl font-bold sm:text-left sm:text-2xl'
            }`}
        >
          {title}
        </h2>
        <div
          className={`${variant === 'favorite' || variant === 'book-shelf' ? 'hidden md:block md:w-28' : ''
            }`}
        ></div>
      </div>
      <div
        className={`text-sm text-muted-foreground ${variant === 'favorite' || variant === 'book-shelf'
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
