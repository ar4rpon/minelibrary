import { BookService } from '@/api/services';
import { BaseCard } from '@/components/common/BaseCard';
import { Button } from '@/components/common/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/common/ui/dropdown-menu';
import { BookDetailDialog } from '@/features/book/components/dialogs/BookDetailDialog';
import { UpdateReadStatusDialog } from '@/features/book/components/dialogs/UpdateReadStatusDialog';
import { useBookMemo } from '@/features/book/hooks/useBookMemo';
import { useBookShelf } from '@/features/book/hooks/useBookShelf';
import { useFavoriteBook } from '@/features/book/hooks/useFavoriteBook';
import { CreateBookShelfDialog } from '@/features/bookshelf/components/dialogs/CreateBookShelfDialog';
import { CreateMemoDialog } from '@/features/memo/components/dialogs/CreateMemoDialog';
import { useBookCardState } from '@/hooks/domain';
import { ReadStatus } from '@/types';
import type { BookData } from '@/types/api';
import { Book, BookOpen, Edit, Heart, Library, Plus } from 'lucide-react';
import { ReadStatusBadge } from '../ReadStatusBadge';
import { Header } from './elements/Header';
import { Image } from './elements/Image';

interface FavoriteCardProps extends BookData {
  readStatus: ReadStatus;
}

/**
 * お気に入りバリアントの書籍カードコンポーネント
 */
export function FavoriteCard(props: FavoriteCardProps) {
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
  } = props;

  const { dialogs, readStatus: readStatusState } = useBookCardState(readStatus);
  const { isFavorite, toggleFavorite } = useFavoriteBook(props);
  const { bookshelves, addToBookshelf, createBookshelf } = useBookShelf();
  const { createMemo } = useBookMemo();

  const handleCreateMemo = async (
    memo: string,
    chapter?: number,
    page?: number,
  ) => {
    await createMemo(isbn, memo, chapter, page);
    dialogs.createMemo.close();
  };

  const handleCreateBookshelf = async (
    bookShelfName: string,
    description: string,
  ) => {
    await createBookshelf(bookShelfName, description);
    dialogs.createBookShelf.close();
  };

  const handleUpdateReadStatus = () => {
    BookService.updateReadStatus(isbn, readStatusState.current);
    dialogs.readStatus.close();
  };

  return (
    <BaseCard variant="book-favorite" {...props}>
      <ReadStatusBadge status={readStatusState.current} />

      <Image imageUrl={image_url} title={title} variant="favorite" />

      <div className="flex flex-col justify-between space-y-4">
        <Header
          title={title}
          author={author}
          publisherName={publisher_name}
          salesDate={sales_date}
          variant="favorite"
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" className="flex-1">
                <Library className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">本棚に追加</span>
                <span className="sm:hidden">追加</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {bookshelves.map((shelf) => (
                <DropdownMenuItem
                  key={shelf.id}
                  className="flex items-center truncate"
                  onClick={() => addToBookshelf(shelf.id, isbn)}
                >
                  <Library className="mr-2 h-4 w-4" />
                  {shelf.book_shelf_name.length > 12
                    ? shelf.book_shelf_name.slice(0, 12) + '...'
                    : shelf.book_shelf_name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                className="flex items-center"
                onClick={dialogs.createBookShelf.open}
              >
                <Plus className="mr-2 h-4 w-4" />
                本棚を作成
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <UpdateReadStatusDialog
        isOpen={dialogs.readStatus.isOpen}
        onClose={dialogs.readStatus.close}
        readStatus={readStatusState.current}
        onChangeValue={readStatusState.set}
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

      <CreateBookShelfDialog
        isOpen={dialogs.createBookShelf.isOpen}
        onClose={dialogs.createBookShelf.close}
        onCreateBookShelfConfirm={handleCreateBookshelf}
      />
    </BaseCard>
  );
}
