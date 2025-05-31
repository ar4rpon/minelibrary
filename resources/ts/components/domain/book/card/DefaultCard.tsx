import { BaseCard } from '@/components/common/BaseCard';
import FavoriteIcon from '@/components/common/Icon/FavoriteIcon';
import { Button } from '@/components/common/ui/button';
import { BookDetailDialog } from '@/components/domain/book/dialogs/BookDetailDialog';
import { useBook } from '@/hooks/domain';
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

  // 統合フックを使用
  const bookHook = useBook();

  // フラグ取得（お気に入り判定は今回の仕様にないため、仮で false 設定）
  const isFavorite = false; // TODO: お気に入り状態の取得方法を確認

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
          <Button onClick={bookHook.dialogs.detailBook.open} className="w-full">
            詳細を見る
          </Button>
          <FavoriteIcon
            isFavorite={isFavorite}
            onClick={() => bookHook.actions.toggleFavorite(props)}
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
        isOpen={bookHook.dialogs.detailBook.isOpen}
        onClose={bookHook.dialogs.detailBook.close}
        onConfirm={bookHook.dialogs.detailBook.close}
        item_caption={item_caption}
      />
    </BaseCard>
  );
}
