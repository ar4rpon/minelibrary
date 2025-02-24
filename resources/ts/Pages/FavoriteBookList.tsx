import BookCard from '@/Components/Book/BookCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select';
import DefaultLayout from '@/Layouts/DefaultLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function FavoriteBookList() {
  const [sortBy, setSortBy] = useState('newDate');
  const { favorites, sortBy: initialSortBy } = usePage().props as any;

  useEffect(() => {
    if (sortBy !== initialSortBy) {
      router.get(route('favorite.index'), { sortBy }, { preserveState: true });
    }
  }, [sortBy]);

  return (
    <DefaultLayout header="FavoriteBookList">
      <Head title="FavoriteBookList" />
      <div className="mb-4">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="並び替え" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newDate">追加が新しい順</SelectItem>
            <SelectItem value="oldDate">追加が古い順</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-y-4">
        {favorites && favorites.length > 0 ? (
          favorites.map((item: any) => (
            <BookCard
              key={item.isbn}
              title={item.book.title}
              author={item.book.author}
              publisherName={item.book.publisher_name || ''}
              salesDate={item.book.sales_date}
              imageUrl={item.book.image_url || ''}
              itemPrice={0}
              isbn={item.isbn}
              itemCaption={item.book.item_caption || '説明はありません。'}
              variant="favorite"
              readStatus={item.read_status}
            />
          ))
        ) : (
          <p className="font-bold">お気に入りの書籍はありません</p>
        )}
      </div>
    </DefaultLayout>
  );
}
