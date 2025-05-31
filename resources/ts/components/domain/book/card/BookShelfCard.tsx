import { BaseCard } from '@/components/common/BaseCard';
import { Button } from '@/components/common/ui/button';
import { BookDetailDialog } from '@/components/domain/book/dialogs/BookDetailDialog';
import { UpdateReadStatusDialog } from '@/components/domain/book/dialogs/UpdateReadStatusDialog';
import { ReadStatusBadge } from '@/components/domain/book/ReadStatusBadge';
import { DeleteBookDialog } from '@/components/domain/bookshelf/dialogs/DeleteBookDialog';
import { CreateMemoDialog } from '@/components/domain/memo/dialogs/CreateMemoDialog';
import { useBook, useBookShelf, useMemo } from '@/hooks/domain';
import { ReadStatus } from '@/types';
import type { BookData } from '@/types/api';
import { Book, BookOpen, Edit, Heart, Library } from 'lucide-react';
import { Header } from './elements/Header';
import { Image } from './elements/Image';

interface BookShelfCardProps extends BookData {
  readStatus: ReadStatus;
  book_shelf_id: number;
}

/**
 * 本棚バリアントの書籍カードコンポーネント
 */
export function BookShelfCard(props: BookShelfCardProps) {
  const {
    title,
    author,
    publisher_name,
    sales_date,
    item_price,
    isbn,
    image_url,
    item_caption,
    readStatus,
    book_shelf_id,
  } = props;

  // 統合フックを使用
  const bookHook = useBook(readStatus);
  const bookShelfHook = useBookShelf();
  const memoHook = useMemo(isbn);

  // フラグ取得（お気に入り判定は今回の仕様にないため、仮で false 設定）
  const isFavorite = false; // TODO: お気に入り状態の取得方法を確認

  const handleCreateMemo = async (
    memo: string,
    chapter?: number,
    page?: number,
  ) => {
    await memoHook.actions.createMemo(memo, chapter, page);
  };

  const handleDeleteBook = async () => {
    // TODO: useBookShelfフックにremoveFromBookshelf機能の追加が必要
    console.warn(
      'removeFromBookshelf function needs to be implemented in useBookShelf hook',
    );
    bookHook.dialogs.deleteBook.close();
  };

  const handleUpdateReadStatus = () => {
    bookHook.actions.updateReadStatus(isbn, bookHook.readStatus.current);
  };

  return (
    <BaseCard variant="book-shelf" {...props}>
      <ReadStatusBadge status={bookHook.readStatus.current} />

      <Image
        imageUrl={image_url}
        title={title}
        variant="book-shelf"
        onClick={bookHook.dialogs.detailBook.open}
      />

      <div className="flex flex-col justify-between space-y-4">
        <Header
          title={title}
          author={author}
          publisherName={publisher_name}
          salesDate={sales_date}
          variant="book-shelf"
        />

        <div className="grid gap-2 sm:grid-cols-2">
          <Button
            className="w-full"
            size="lg"
            onClick={bookHook.dialogs.readStatus.open}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            <span>進捗を変更</span>
          </Button>
          <Button
            variant="outline"
            className="w-full"
            size="lg"
            onClick={memoHook.dialogs.create.open}
          >
            <Edit className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">メモを書く</span>
            <span className="sm:hidden">メモ</span>
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={bookHook.dialogs.detailBook.open}
            variant="secondary"
            size="sm"
            className="flex-1"
          >
            <Book className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">詳細を見る</span>
            <span className="sm:hidden">詳細</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => bookHook.actions.toggleFavorite(props)}
          >
            <Heart
              className={`mr-2 h-4 w-4 ${isFavorite ? 'fill-current' : ''}`}
            />
            <p className="hidden sm:inline">
              {isFavorite ? 'お気に入り解除' : 'お気に入り'}
            </p>
            <p className="sm:hidden">{isFavorite ? '解除' : '追加'}</p>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={bookHook.dialogs.deleteBook.open}
          >
            <Library className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">本棚から削除する</span>
            <span className="sm:hidden">削除</span>
          </Button>
        </div>
      </div>

      <UpdateReadStatusDialog
        isOpen={bookHook.dialogs.readStatus.isOpen}
        onClose={bookHook.dialogs.readStatus.close}
        readStatus={bookHook.readStatus.current}
        onChangeValue={bookHook.readStatus.set}
        onConfirm={handleUpdateReadStatus}
      />

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

      <CreateMemoDialog
        isOpen={memoHook.dialogs.create.isOpen}
        onClose={memoHook.dialogs.create.close}
        onMemoConfirm={handleCreateMemo}
        isbn={isbn}
      />

      <DeleteBookDialog
        isOpen={bookHook.dialogs.deleteBook.isOpen}
        onClose={bookHook.dialogs.deleteBook.close}
        onDeleteBookConfirm={handleDeleteBook}
      />
    </BaseCard>
  );
}
