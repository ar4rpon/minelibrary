import { DefaultLayout } from '@/components/common/layout';
import { BookCard } from '@/components/domain/book/card';
import { BookShelfDetailCard } from '@/components/domain/bookshelf';
import { ReadStatus } from '@/types/domain/book';
import { Head } from '@inertiajs/react';

interface BookShelfBook {
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

interface BookShelfDetailProps {
  bookShelf: {
    id: number;
    book_shelf_name: string;
    description: string;
    is_public: boolean;
    user_name: string;
  };
  books: BookShelfBook[];
}

/**
 * 本棚詳細ページ
 * 特定の本棚の詳細情報と登録されている書籍を表示する
 */
export default function BookShelfDetail({
  bookShelf,
  books,
}: BookShelfDetailProps) {
  return (
    <DefaultLayout header="本棚詳細">
      <Head title={bookShelf.book_shelf_name} />

      <BookShelfDetailCard
        name={bookShelf.book_shelf_name}
        description={bookShelf.description}
        bookShelfId={bookShelf.id}
        isPublic={bookShelf.is_public}
        userName={bookShelf.user_name}
      />

      <div className="mt-8 grid grid-cols-1 gap-y-4">
        {books && books.length > 0 ? (
          books.map((item: BookShelfBook) => (
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
