interface ImageProps {
  imageUrl: string;
  title: string;
  variant?: 'favorite' | 'default' | 'book-shelf';
}

/**
 * 書籍画像を表示するコンポーネント
 */
export function Image({ imageUrl, title, variant = 'default' }: ImageProps) {
  return (
    <div
      className={`mx-auto aspect-[3/4] w-full max-w-[200px] overflow-hidden rounded-md border-2 border-gray-200 shadow-lg ${
        variant === 'favorite' || variant === 'book-shelf' ? '' : 'shrink-0'
      }`}
    >
      <img
        src={imageUrl || '/placeholder.svg'}
        alt={title}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
