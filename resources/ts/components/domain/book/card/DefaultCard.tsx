// 1. React and external libraries
// (none in this component)

// 2. Internal API/services
// (none in this component)

// 3. UI components
import { Button } from '@/components/ui/button';

// 4. Common components
import { BaseCard } from '@/components/common/BaseCard';
import FavoriteIcon from '@/components/common/Icon/FavoriteIcon';

// 5. Domain components
import { BookDetailDialog } from '@/components/domain/book/dialogs/BookDetailDialog';

// 6. Hooks
import { useBookCardState } from '@/hooks/domain';
import { useFavoriteBook } from '@/hooks/domain/useFavoriteBook';

// 7. Types
import type { BookData } from '@/types/api';

// 8. Local/relative imports
import { Header } from './elements/Header';
import { Image } from './elements/Image';

interface DefaultCardProps extends BookData {
  // 拡張プロパティがある場合はここに追加
}

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
