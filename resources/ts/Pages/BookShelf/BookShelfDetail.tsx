import { useEffect, useState } from 'react';
import BookCard from '@/Components/Book/BookCard';
import BookShelfDescription from '@/Components/BookShelf/BookShelfDescription';
import { AddBookDialog } from '@/Dialog/BookShelf/AddBookDialog';
import DefaultLayout from '@/Layouts/DefaultLayout';
import { Head } from '@inertiajs/react';

interface BookShelfDetailProps {
  bookShelf: {
    id: number;
    book_shelf_name: string;
    description: string;
    is_public: boolean;
  };
  books: any[];
}

export default function BookShelfDetail({ bookShelf, books }: BookShelfDetailProps) {
  return (
    <DefaultLayout header="本棚詳細">
      <Head title={bookShelf.book_shelf_name} />
      <BookShelfDescription
        name={bookShelf.book_shelf_name}
        description={bookShelf.description}
      // isPublic={bookShelf.is_public}
      />
      <div className="mt-8 grid grid-cols-1 gap-y-4">
        {books && books.length > 0 ? (
          books.map((item: any) => (
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
              variant="book-shelf"
              readStatus={item.read_status}
              book_shelf_id={bookShelf.id}
            />
          ))
        ) : (
          <p className="font-bold">本棚に書籍はありません</p>
        )}
      </div>
    </DefaultLayout>
  );
}
