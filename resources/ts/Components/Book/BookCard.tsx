import FavoriteIcon from '@/Components/Icon/FavoriteIcon';
import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/card';
import { BookDetailDialog } from '@/Dialog/Book/BookDetailDialog';
import { BookProps } from '@/types';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function BookCard({
  title,
  author,
  publisherName,
  salesDate,
  itemPrice,
  isbn,
  imageUrl,
  itemCaption,
}: BookProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [detailBookDialogOpen, setDetailBookDialogOpen] = useState(false);
  const handleDetailBook = () => {
    setDetailBookDialogOpen(true);
  };

  const confirmDetailBook = () => {
    console.log('Delete note:');
    setDetailBookDialogOpen(false);
  };

  // お気に入り状態を取得
  useEffect(() => {
    axios
      .get('/books/favorite-status', { params: { isbn } })
      .then((response) => setIsFavorite(response.data.isFavorite));
  }, [isbn]);

  // お気に入り追加処理
  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    axios.post('/books/toggle-favorite', {
      isbn: isbn,
      title: title,
      author: author,
      publisher_name: publisherName,
      sales_date: salesDate,
      image_url: imageUrl,
      item_caption: itemCaption,
      item_price: itemPrice,
    });
  };

  return (
    <Card className="mx-auto w-full max-w-4xl overflow-hidden p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row lg:flex-col">
        <div className="mx-auto flex aspect-[3/4] w-full max-w-[200px] shrink-0 items-center justify-center overflow-hidden rounded-md border-2 border-gray-200 shadow-lg">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-1 flex-col justify-between space-y-4">
          <div className="space-y-2">
            <h2 className="w-full truncate text-xl font-bold sm:text-left sm:text-2xl">
              {title}
            </h2>
            <div className="space-y-1 text-sm text-muted-foreground sm:text-left">
              <p className="w-full truncate">{`${salesDate} / ${author} / ${publisherName}`}</p>
              <p className="text-lg font-semibold text-red-600">
                ¥{itemPrice.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={handleDetailBook} className="w-full">
              詳細を見る
            </Button>
            <BookDetailDialog
              title={title}
              author={author}
              publisherName={publisherName}
              salesDate={salesDate}
              itemPrice={itemPrice}
              isbn={isbn}
              imageUrl={imageUrl}
              isOpen={detailBookDialogOpen}
              onClose={() => setDetailBookDialogOpen(false)}
              onConfirm={confirmDetailBook}
              itemCaption={itemCaption}
            />
            <FavoriteIcon
              isFavorite={isFavorite}
              onClick={() => handleFavoriteClick()}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
