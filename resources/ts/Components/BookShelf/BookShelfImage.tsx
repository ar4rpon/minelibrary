import React from 'react';

interface BookShelfImageProps {
  imageUrl: string;
  name: string;
  variant?: 'card' | 'description';
}

/**
 * 本棚の画像を表示するコンポーネント
 */
export function BookShelfImage({
  imageUrl,
  name,
  variant = 'card'
}: BookShelfImageProps) {
  const DEFAULT_IMAGE = 'https://placehold.jp/150x150.png';

  return (
    <div className={`
      ${variant === 'card'
        ? 'flex items-center'
        : 'mx-auto aspect-[1/1] w-full max-w-[200px] overflow-hidden rounded-md border-2 border-gray-200 shadow-lg'
      }
    `}>
      <img
        src={imageUrl || DEFAULT_IMAGE}
        alt={`${name}の表紙`}
        className={`
          ${variant === 'card'
            ? 'h-24 w-20 rounded-md border-2 object-cover'
            : 'h-full w-full object-cover'
          }
        `}
      />
    </div>
  );
}
