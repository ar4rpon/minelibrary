import BookGenreSelect from '@/components/book/BookGenreSelect';
import BookCard from '@/components/book/card';
import CommonPagination from '@/components/common/CommonPagination';
import DefaultLayout from '@/components/common/layout';
import { Button } from '@/components/common/ui/button';
import { Input } from '@/components/common/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/common/ui/select';
import { BookData } from '@/Services/bookService';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

// 楽天APIのレスポンス構造に合わせてインターフェースを修正
interface Book {
  Item: BookData;
}

// ページプロパティの型定義
interface PageProps {
  results: Book[];
  totalItems: number;
  filters: {
    keyword?: string;
    page?: number;
    genre?: string;
    sort?: string;
    searchMethod?: 'title' | 'isbn';
  };
}

const SearchPage = () => {
  const { results, totalItems, filters } = usePage()
    .props as unknown as PageProps;
  console.log('Page props:', usePage().props);

  const [searchTerm, setSearchTerm] = useState(filters.keyword || '');
  const [searchMethod, setSearchMethod] = useState<'title' | 'isbn'>(
    filters.searchMethod || 'title',
  );
  const [genre, setGenre] = useState('001');
  const [sortBy, setSortBy] = useState('standard');
  const [currentPage, setCurrentPage] = useState(filters.page || 1);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 9;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const searchBooks = () => {
    setLoading(true);
    router.get(
      route('book.search'),
      {
        keyword: searchTerm,
        page: currentPage,
        genre: genre,
        sort: sortBy,
        searchMethod: searchMethod,
      },
      {
        preserveState: true,
        preserveScroll: true,
        only: ['results', 'totalItems', 'filters'],
        onFinish: () => setLoading(false),
      },
    );
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  // 初期検索を行うためのuseEffect
  useEffect(() => {
    if (filters.page !== currentPage) {
      searchBooks();
    }
  }, [filters.page, currentPage]);

  useEffect(() => {
    setCurrentPage(filters.page || 1);
  }, [filters.page]);

  return (
    <DefaultLayout header="検索ページ">
      <Head title="検索ページ" />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <Select
          value={searchMethod}
          onValueChange={(v: 'title' | 'isbn') => setSearchMethod(v)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="検索方法" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">タイトル</SelectItem>
            <SelectItem value="isbn">ISBN</SelectItem>
          </SelectContent>
        </Select>

        <BookGenreSelect value={genre} onValueChange={setGenre} />

        <Input
          placeholder="検索キーワードを入力"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />

        <Button
          onClick={searchBooks}
          disabled={loading}
          className="w-full sm:w-auto"
        >
          {loading ? '検索中...' : '検索'}
        </Button>
      </div>

      <div className="mb-4">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="並び替え" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">標準</SelectItem>
            <SelectItem value="sales">売れている順</SelectItem>
            <SelectItem value="-releaseDate">発売日が新しい順</SelectItem>
            <SelectItem value="+releaseDate">発売日が古い順</SelectItem>
            <SelectItem value="+item_price">価格が安い順</SelectItem>
            <SelectItem value="-item_price">価格が高い順</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {results && results.length > 0 ? (
          results.map((item) => (
            <BookCard
              key={item.Item.isbn}
              title={item.Item.title}
              author={item.Item.author}
              publisher_name={item.Item.publisher_name || ''}
              sales_date={item.Item.sales_date}
              item_price={item.Item.item_price}
              isbn={item.Item.isbn}
              image_url={item.Item.image_url || ''}
              item_caption={item.Item.item_caption || '説明はありません。'}
            />
          ))
        ) : (
          <p className="font-bold">検索結果がありません</p>
        )}
      </div>

      <CommonPagination
        totalPages={totalPages}
        totalItems={totalItems}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
      />
    </DefaultLayout>
  );
};

export default SearchPage;
