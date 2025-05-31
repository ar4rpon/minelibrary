import { BaseCard } from '@/components/common/BaseCard';
import FavoriteIcon from '@/components/common/Icon/FavoriteIcon';
import { Button } from '@/components/common/ui/button';
import { BookDetailDialog } from '@/features/book/components/dialogs/BookDetailDialog';
import { useFavoriteBook } from '@/features/book/hooks/useFavoriteBook';
import { useBookCardState } from '@/hooks/domain';
import type { BookData } from '@/types/api';
import { Header } from './elements/Header';
import { Image } from './elements/Image';

interface DefaultCardProps extends BookData {}

/**
 * デフォルトバリアントの書籍カードコンポーネント
 */
export function DefaultCard(props: DefaultCardProps) {
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
    <BaseCard variant="book-default" {...props}>
      <Image imageUrl={image_url} title={title} variant="default" />

      <div className="flex flex-1 flex-col justify-between space-y-4">
        <Header
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
          <FavoriteIcon isFavorite={isFavorite} onClick={toggleFavorite} />
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
    </BaseCard>
  );
}
