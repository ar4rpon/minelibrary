import BookCard from '@/Components/Book/BookCard';
import { ReadStatus } from '@/types';
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

interface FavoriteBook {
  isbn: string;
  read_status: ReadStatus;
  book: {
    title: string;
    author: string;
    publisher_name: string;
    sales_date: string;
    image_url: string;
    item_price: number;
    item_caption: string;
  };
}

interface FavoritePageProps {
  favorites: FavoriteBook[];
  sortBy: string;
}

export default function FavoriteBookList() {
  const [sortBy, setSortBy] = useState('newDate');
  const { favorites, sortBy: initialSortBy } = usePage().props as unknown as FavoritePageProps;

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
          favorites.map((item: FavoriteBook) => (
            <BookCard
              key={item.isbn}
              title={item.book.title}
              author={item.book.author}
              publisher_name={item.book.publisher_name || ''}
              sales_date={item.book.sales_date}
              image_url={item.book.image_url || ''}
              item_price={item.book.item_price}
              isbn={item.isbn}
              item_caption={item.book.item_caption || '説明はありません。'}
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
