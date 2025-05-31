import DefaultLayout from '@/components/common/layout';
import BookCard from '@/components/domain/book/card';
import { BookShelfDetailCard } from '@/components/domain/bookshelf';
import { ReadStatus } from '@/types';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface BookShelfBook {
  isbn: string;
  read_status: ReadStatus | null;
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

interface SharedBookShelfDetailProps {
  bookShelf: {
    id: number;
    book_shelf_name: string;
    description: string;
    is_public: boolean;
    user_name: string;
  };
  books: BookShelfBook[];
  isShared: boolean;
  expiryDate: string;
}

/**
 * 共有本棚詳細ページ
 * 共有リンクを通じて閲覧できる本棚の詳細情報と登録されている書籍を表示する
 */
export default function SharedBookShelfDetail({
  bookShelf,
  books,
  isShared,
  expiryDate,
}: SharedBookShelfDetailProps) {
  const formattedExpiryDate = expiryDate
    ? format(new Date(expiryDate), 'yyyy年MM月dd日', { locale: ja })
    : '';

  return (
    <DefaultLayout header="共有本棚">
      <Head title={`${bookShelf.book_shelf_name} (共有)`} />

      <div className="mb-4 rounded-md border border-yellow-200 bg-yellow-50 p-4">
        <p className="text-sm text-yellow-700">
          これは共有リンクを通じて閲覧している本棚です。閲覧期限:{' '}
          {formattedExpiryDate}
        </p>
      </div>

      <BookShelfDetailCard
        name={bookShelf.book_shelf_name}
        description={bookShelf.description}
        bookShelfId={bookShelf.id}
        isPublic={bookShelf.is_public}
        userName={bookShelf.user_name}
        isShared={isShared}
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
              variant="shared"
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
