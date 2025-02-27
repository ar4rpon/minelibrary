import { ReadStatusBadge } from '@/components/book/ReadStatusBadge';
import { Button } from '@/components/common/ui/button';
import { BookDetailDialog } from '@/Dialog/Book/BookDetailDialog';
import { UpdateReadStatusDialog } from '@/Dialog/Book/UpdateReadStatusDialog';
import { CreateMemoDialog } from '@/Dialog/Memo/CreateMemoDialog';
import { useBookCardState } from '@/features/book/hooks/useBookCardState';
import { useBookMemo } from '@/features/book/hooks/useBookMemo';
import { useBookShelf } from '@/features/book/hooks/useBookShelf';
import { useFavoriteBook } from '@/features/book/hooks/useFavoriteBook';
import { DeleteBookDialog } from '@/features/bookshelf/components/dialogs/DeleteBookDialog';
import { BookData, BookService } from '@/Services/bookService';
import { ReadStatus } from '@/types';
import { Book, BookOpen, Edit, Heart, Library } from 'lucide-react';
import { BaseCard } from './BaseCard';
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

  const { dialogs, readStatus: readStatusState } = useBookCardState(readStatus);
  const { isFavorite, toggleFavorite } = useFavoriteBook(props);
  const { removeFromBookshelf } = useBookShelf();
  const { createMemo } = useBookMemo();

  const handleCreateMemo = async (
    memo: string,
    chapter?: number,
    page?: number,
  ) => {
    await createMemo(isbn, memo, chapter, page);
    dialogs.createMemo.close();
  };

  const handleDeleteBook = async () => {
    await removeFromBookshelf(book_shelf_id, isbn);
    dialogs.deleteBook.close();
  };

  const handleUpdateReadStatus = () => {
    BookService.updateReadStatus(isbn, readStatusState.status);
    dialogs.readStatus.close();
  };

  return (
    <BaseCard variant="book-shelf" {...props}>
      <ReadStatusBadge status={readStatusState.status} />

      <Image imageUrl={image_url} title={title} variant="book-shelf" />

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
            onClick={dialogs.readStatus.open}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            <span>進捗を変更</span>
          </Button>
          <Button
            variant="outline"
            className="w-full"
            size="lg"
            onClick={dialogs.createMemo.open}
          >
            <Edit className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">メモを書く</span>
            <span className="sm:hidden">メモ</span>
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={dialogs.detailBook.open}
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
            onClick={toggleFavorite}
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
            onClick={dialogs.deleteBook.open}
          >
            <Library className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">本棚から削除する</span>
            <span className="sm:hidden">削除</span>
          </Button>
        </div>
      </div>

      <UpdateReadStatusDialog
        isOpen={dialogs.readStatus.isOpen}
        onClose={dialogs.readStatus.close}
        readStatus={readStatusState.status}
        onChangeValue={readStatusState.setStatus}
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
        isOpen={dialogs.detailBook.isOpen}
        onClose={dialogs.detailBook.close}
        onConfirm={dialogs.detailBook.close}
        item_caption={item_caption}
      />

      <CreateMemoDialog
        isOpen={dialogs.createMemo.isOpen}
        onClose={dialogs.createMemo.close}
        onMemoConfirm={handleCreateMemo}
        isbn={isbn}
      />

      <DeleteBookDialog
        isOpen={dialogs.deleteBook.isOpen}
        onClose={dialogs.deleteBook.close}
        onDeleteBookConfirm={handleDeleteBook}
      />
    </BaseCard>
  );
}
