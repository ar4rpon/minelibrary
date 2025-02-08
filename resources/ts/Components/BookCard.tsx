import { Card } from '@/Components/ui/card';
import { BookDetailDialog } from '@/Dialog/BookDetailDialog';
import { BookProps } from '@/types';
import { useState } from 'react';
import FavoriteIcon from './FavoriteIcon';
import { Button } from './ui/button';

export default function BookCard({
  title = '本のタイトル',
  author = '著者名',
  publisher = '出版社',
  publishDate = '2024年2月2日',
  price = 1500,
  imageUrl = 'https://shop.r10s.jp/book/cabinet/9163/9784297129163_1_4.jpg',
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
            src={imageUrl || '/placeholder.svg'}
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
              <p>{`${publishDate} / ${author} / ${publisher}`}</p>
              <p className="text-lg font-semibold">¥{price.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={handleDetailBook} className="w-full">
              詳細を見る
            </Button>
            <BookDetailDialog
              title={title}
              author={author}
              publisher={publisher}
              publishDate={publishDate}
              price={1500}
              imageUrl={imageUrl}
              isOpen={detailBookDialogOpen}
              onClose={() => setDetailBookDialogOpen(false)}
              onConfirm={confirmDetailBook}
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
