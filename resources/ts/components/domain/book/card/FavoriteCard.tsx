import { BookService } from '@/api/services';
import { BaseCard } from '@/components/common/BaseCard';
import { BookDetailDialog } from '@/components/domain/book/dialogs/BookDetailDialog';
import { UpdateReadStatusDialog } from '@/components/domain/book/dialogs/UpdateReadStatusDialog';
import { CreateBookShelfDialog } from '@/components/domain/bookshelf/dialogs/CreateBookShelfDialog';
import { CreateMemoDialog } from '@/components/domain/memo/dialogs/CreateMemoDialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useBookCardState } from '@/hooks/domain';
import { useBookMemo } from '@/hooks/domain/useBookMemo';
import { useBookShelf } from '@/hooks/domain/useBookShelf';
import { useFavoriteBook } from '@/hooks/domain/useFavoriteBook';
import type { BookData } from '@/types/api';
import { ReadStatus } from '@/types/domain/book';
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

  const handleAddToBookshelf = async (shelfId: number, isbn: string) => {
    try {
      await addToBookshelf(shelfId, isbn);
      // 成功時は特に何もしない（静的なフィードバックは今回は省略）
    } catch (error) {
      console.error('Failed to add book to shelf:', error);
      // エラー時の処理（今回は簡単なログのみ）
    }
  };

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
    try {
      await createBookshelf(bookShelfName, description);
      dialogs.createBookShelf.close();
    } catch (error) {
      console.error('Failed to create bookshelf:', error);
      // エラー時はダイアログを閉じない（ユーザーが再試行できるように）
    }
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
              {Array.isArray(bookshelves) && bookshelves.length > 0 ? (
                bookshelves.map((shelf) => (
                  <DropdownMenuItem
                    key={shelf.id}
                    className="flex items-center truncate"
                    onClick={() => handleAddToBookshelf(shelf.id, isbn)}
                  >
                    <Library className="mr-2 h-4 w-4" />
                    {shelf.book_shelf_name && shelf.book_shelf_name.length > 12
                      ? shelf.book_shelf_name.slice(0, 12) + '...'
                      : shelf.book_shelf_name || '無名の本棚'}
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>
                  本棚がありません
                </DropdownMenuItem>
              )}
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
