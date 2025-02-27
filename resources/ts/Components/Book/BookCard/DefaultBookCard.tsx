import React from 'react';
import { Button } from '@/Components/ui/button';
import { BookDetailDialog } from '@/Dialog/Book/BookDetailDialog';
import { BookData } from '@/Services/bookService';
import { BaseBookCard } from './BaseBookCard';
import { BookCardImage } from './BookCardImage';
import { BookCardHeader } from './BookCardHeader';
import { useBookCardState } from './hooks/useBookCardState';
import { useFavoriteBook } from './hooks/useFavoriteBook';
import FavoriteIcon from '@/Components/Icon/FavoriteIcon';

interface DefaultBookCardProps extends BookData { }

/**
 * デフォルトバリアントの書籍カードコンポーネント
 */
export function DefaultBookCard(props: DefaultBookCardProps) {
  const {
    title,
    author,
    publisher_name,
    sales_date,
    item_price,
    isbn,
    image_url,
    item_caption,
  } = props;

  const { dialogs } = useBookCardState();
  const { isFavorite, toggleFavorite } = useFavoriteBook(props);

  return (
    <BaseBookCard variant="default" {...props}>
      <BookCardImage
        imageUrl={image_url}
        title={title}
        variant="default"
      />

      <div className="flex flex-col justify-between flex-1 space-y-4">
        <BookCardHeader
          title={title}
          author={author}
          publisherName={publisher_name}
          salesDate={sales_date}
          itemPrice={item_price}
          variant="default"
        />

        <div className="flex items-center gap-2">
          <Button onClick={dialogs.detailBook.open} className="w-full">
            詳細を見る
          </Button>
          <FavoriteIcon
            isFavorite={isFavorite}
            onClick={toggleFavorite}
          />
        </div>
      </div>

      <BookDetailDialog
        title={title}
        author={author}
        publisher_name={publisher_name}
        sales_date={sales_date}
        item_price={item_price}
        isbn={isbn}
        image_url={image_url}
        isOpen={dialogs.detailBook.isOpen}
        onClose={dialogs.detailBook.close}
        onConfirm={dialogs.detailBook.close}
        item_caption={item_caption}
      />
    </BaseBookCard>
  );
}
