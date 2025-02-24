import FavoriteIcon from '@/Components/Icon/FavoriteIcon';
import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/card';
import { BookDetailDialog } from '@/Dialog/Book/BookDetailDialog';
import { UpdateReadStatusDialog } from '@/Dialog/Book/UpdateReadStatusDialog';
import { CreateMemoDialog } from '@/Dialog/Memo/CreateMemoDialog';
import { BookProps, ReadStatus } from '@/types';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { Book, BookOpen, Edit, Heart, Library } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ReadStatusBadge } from './ReadStatusBadge';

interface UnifiedBookCardProps extends BookProps {
  variant?: 'favorite' | 'default';
}

export default function BookCard({
  title,
  author,
  publisher_name,
  sales_date,
  item_price,
  isbn,
  image_url,
  item_caption,
  variant = 'default',
  readStatus,
}: UnifiedBookCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [detailBookDialogOpen, setDetailBookDialogOpen] = useState(false);
  const [readStatusDialogOpen, setReadStatusDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ReadStatus>(
    readStatus ?? 'want_read',
  );
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const handleDetailBook = () => setDetailBookDialogOpen(true);
  const confirmDetailBook = () => setDetailBookDialogOpen(false);

  useEffect(() => {
    axios
      .get('/books/favorite-status', { params: { isbn } })
      .then((response) => setIsFavorite(response.data.isFavorite));
  }, [isbn]);

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    axios.post('/books/toggle-favorite', {
      isbn,
      title,
      author,
      publisher_name,
      sales_date,
      image_url,
      item_caption,
      item_price,
    });
  };

  const confirmCreate = async (
    memo: string,
    chapter?: number,
    page?: number,
  ) => {
    try {
      await axios.post('/memo/create', {
        isbn: isbn,
        memo,
        memo_chapter: chapter,
        memo_page: page,
      });
      router.reload();
    } catch (error) {
      console.error('Failed to create memo:', error);
    }
    setCreateDialogOpen(false);
  };

  const updateReadStatus = (readStatus: ReadStatus) => {
    setReadStatusDialogOpen(false);
    axios.post('/books/update-status', {
      isbn,
      readStatus: readStatus,
    });
  };

  return (
    <Card
      className={`mx-auto w-full ${variant === 'favorite' ? 'p-4' : 'max-w-4xl overflow-hidden p-4 md:p-6'}`}
    >
      <div
        className={
          variant === 'favorite'
            ? 'relative grid gap-4 sm:grid-cols-[200px_1fr]'
            : 'flex flex-col gap-4 md:flex-row lg:flex-col'
        }
      >
        {variant === 'favorite' && selectedStatus && (
          <ReadStatusBadge status={selectedStatus} />
        )}

        <div
          className={`mx-auto aspect-[3/4] w-full max-w-[200px] overflow-hidden rounded-md border-2 border-gray-200 shadow-lg ${variant === 'favorite' ? '' : 'shrink-0'
            }`}
        >
          <img
            src={image_url || '/placeholder.svg'}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>

        <div
          className={`flex flex-col justify-between ${variant === 'favorite' ? 'space-y-4' : 'flex-1 space-y-4'
            }`}
        >
          <div className="space-y-2">
            <div className="flex">
              <h2
                className={`${variant === 'favorite'
                  ? 'text-xl font-bold sm:text-2xl'
                  : 'w-full truncate text-xl font-bold sm:text-left sm:text-2xl'
                  }`}
              >
                {title}
              </h2>
              <div
                className={`${variant === 'favorite' ? 'hidden md:block md:w-28' : ''}`}
              ></div>
            </div>
            <div
              className={`text-sm text-muted-foreground ${variant === 'favorite' ? 'space-y-1' : 'space-y-1 sm:text-left'
                }`}
            >
              <p className={variant === 'default' ? 'w-full truncate' : ''}>
                {`${sales_date} / ${author} / ${publisher_name}`}
              </p>
              {variant === 'default' && (
                <p className="text-lg font-semibold text-red-600">
                  ¥{item_price.toLocaleString()}
                </p>
              )}
            </div>
          </div>

          {variant === 'favorite' ? (
            <>
              <div className="grid gap-2 sm:grid-cols-2">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => setReadStatusDialogOpen(true)}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>進捗を変更</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  size="lg"
                  onClick={() => setCreateDialogOpen(true)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">メモを書く</span>
                  <span className="sm:hidden">メモ</span>
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleDetailBook}
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
                  onClick={handleFavoriteClick}
                >
                  <Heart
                    className={`mr-2 h-4 w-4 ${isFavorite ? 'fill-current' : ''}`}
                  />
                  {isFavorite ? 'お気に入り解除' : 'お気に入り'}
                </Button>
                <Button variant="secondary" size="sm" className="flex-1">
                  <Library className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">本棚に追加</span>
                  <span className="sm:hidden">本棚</span>
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button onClick={handleDetailBook} className="w-full">
                詳細を見る
              </Button>
              <FavoriteIcon
                isFavorite={isFavorite}
                onClick={handleFavoriteClick}
              />
            </div>
          )}
        </div>

        {readStatus && (
          <UpdateReadStatusDialog
            isOpen={readStatusDialogOpen}
            onClose={() => setReadStatusDialogOpen(false)}
            readStatus={selectedStatus}
            onChangeValue={setSelectedStatus}
            onConfirm={() => updateReadStatus(selectedStatus)}
          />
        )}

        <BookDetailDialog
          title={title}
          author={author}
          publisher_name={publisher_name}
          sales_date={sales_date}
          item_price={item_price}
          isbn={isbn}
          image_url={image_url}
          isOpen={detailBookDialogOpen}
          onClose={() => setDetailBookDialogOpen(false)}
          onConfirm={confirmDetailBook}
          item_caption={item_caption}
        />
        <CreateMemoDialog
          isOpen={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onMemoConfirm={confirmCreate}
          isbn={isbn}
        />
      </div>
    </Card>
  );
}
