interface ImageProps {
  variant?: 'card' | 'description';
}

/**
 * 本棚の画像を表示するコンポーネント
 */
export function Image({ variant = 'card' }: ImageProps) {
  return (
    <div
      className={` ${
        variant === 'card'
          ? 'flex items-center'
          : 'mx-auto aspect-[1/1] w-full max-w-[200px] overflow-hidden rounded-md border-2 border-gray-200 shadow-lg'
      } `}
    ></div>
  );
}
