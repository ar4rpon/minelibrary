import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/card';
import { BookDetailDialog } from '@/Dialog/Book/BookDetailDialog';
import { BookProps } from '@/types';
import axios from 'axios';
import { Book, BookOpen, Edit, Heart, Library } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BookStatusBadge } from './BookStatusBadge';

export default function FavoriteBookCard({
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

  useEffect(() => {
    axios
      .get('/books/favorite-status', { params: { isbn } })
      .then((response) => setIsFavorite(response.data.isFavorite));
  }, [isbn]);

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
    <Card className="mx-auto w-full p-4">
      <div className="relative grid gap-4 sm:grid-cols-[200px_1fr]">
        <BookStatusBadge status={'done_read'} />
        <div className="mx-auto aspect-[3/4] w-full max-w-[200px] overflow-hidden rounded-md border-2 border-gray-200 shadow-lg">
          <img
            src={imageUrl || '/placeholder.svg'}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex">
              <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
              <div className="w-28"></div>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>{`${salesDate} / ${author} / ${publisherName}`}</p>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <Button className="w-full" size="lg">
              <BookOpen className="mr-2 h-4 w-4" />
              <span>進捗を変更</span>
            </Button>

            <Button variant="outline" className="w-full" size="lg">
              <Edit className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">メモを書く</span>
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
              onClick={() => handleFavoriteClick()}
            >
              <Heart
                className={`mr-2 h-4 w-4 ${isFavorite ? 'fill-current' : ''}`}
              />
              {isFavorite ? (
                <>
                  <span className="sm:hidden">解除</span>
                  <span className="hidden sm:inline">お気に入り解除</span>
                </>
              ) : (
                <span>お気に入り</span>
              )}
            </Button>

            <Button variant="secondary" size="sm" className="flex-1">
              <Library className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">本棚に追加</span>
              <span className="sm:hidden">本棚</span>
            </Button>
          </div>

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
        </div>
      </div>
    </Card>
  );
}
