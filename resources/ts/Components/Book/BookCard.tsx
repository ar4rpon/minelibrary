import { Card } from '@/Components/ui/card';
import { BookDetailDialog } from '@/Dialog/Book/BookDetailDialog';
import { BookProps } from '@/types';
import { useState } from 'react';
import FavoriteIcon from '@/Components/Book/FavoriteIcon';
import { Button } from '@/Components/ui/button';

export default function BookCard({
  title = '本のタイトル',
  author = '著者名',
  publisherName = '出版社',
  salesDate = '2024年2月2日',
  itemPrice = 1500,
  isbn = "",
  largeImageUrl = 'https://shop.r10s.jp/book/cabinet/9163/9784297129163_1_4.jpg',
  itemCaption = '説明はありません。'
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

  return (
    <Card className="mx-auto w-full max-w-4xl overflow-hidden p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row lg:flex-col">
        <div className="mx-auto flex aspect-[3/4] w-full max-w-[200px] shrink-0 items-center justify-center overflow-hidden rounded-md border-2 border-gray-200 shadow-lg">
          <img
            src={largeImageUrl || '/placeholder.svg'}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-1 flex-col justify-between space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-bold sm:text-left sm:text-2xl">
              {title}
            </h2>
            <div className="space-y-1 text-sm text-muted-foreground sm:text-left">
              <p>{`${salesDate} / ${author} / ${publisherName}`}</p>
              <p className="text-lg font-semibold">¥{itemPrice.toLocaleString()}</p>
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
              largeImageUrl={largeImageUrl}
              isOpen={detailBookDialogOpen}
              onClose={() => setDetailBookDialogOpen(false)}
              onConfirm={confirmDetailBook}
              itemCaption={itemCaption}
            />
            <FavoriteIcon
              isFavorite={isFavorite}
              onClick={() => setIsFavorite(!isFavorite)}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
