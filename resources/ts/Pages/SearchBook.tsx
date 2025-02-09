import BookCard from '@/Components/BookCard';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationNext,
  PaginationPrevious,
} from '@/Components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select';
import DefaultLayout from '@/Layouts/DefaultLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface Book {
  id: string;
  title: string;
  authors: string[];
  publishedDate: string;
  isbn?: string;
  publisher?: string;
}

interface ApiResponse {
  items: Book[];
  totalItems: number;
}

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchMethod, setSearchMethod] = useState<'title' | 'isbn'>('title');
  const [genre, setGenre] = useState('all');
  const [sortBy, setSortBy] = useState('standard');
  const [currentPage, setCurrentPage] = useState(1);
  const [results, setResults] = useState<Book[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 9;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const searchBooks = async () => {
    setLoading(true);
    try {
      // テストデータ
      const testData: ApiResponse = {
        items: Array.from({ length: 30 }, (_, index) => ({
          id: `${index + 1}`,
          title: `テスト本${index + 1}`,
          authors: [`著者${index + 1}`],
          publishedDate: '2023-01-01',
          isbn: `123456789${index}`,
          publisher: `出版社${index + 1}`,
        })),
        totalItems: 30,
      };

      // API呼び出しの代わりにテストデータを使用
      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedItems = testData.items.slice(
        startIndex,
        startIndex + itemsPerPage,
      );
      setResults(paginatedItems);
      setTotalItems(testData.totalItems);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0); // ページの一番上に移動
  };

  useEffect(() => {
    searchBooks();
  }, [currentPage]);

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

        <Select value={genre} onValueChange={setGenre}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="ジャンル" />
          </SelectTrigger>
          {/* 楽天BooksAPIからジャンルを取得する（あらかじめDBに登録しておいてそれを持ってくる） */}
          <SelectContent>
            <SelectItem value="all">すべてのジャンル</SelectItem>
            <SelectItem value="programming">プログラミング</SelectItem>
            <SelectItem value="business">ビジネス</SelectItem>
          </SelectContent>
        </Select>

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
            <SelectItem value="standard">おすすめ順</SelectItem>
            <SelectItem value="sales">人気順</SelectItem>
            <SelectItem value="-releaseDate">発売が新しい順</SelectItem>
            <SelectItem value="+releaseDate">発売が古い順</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {results.map((book) => (
          <BookCard
            key={book.id}
            title={book.title}
            author={book.authors.join(', ')}
            publisher={book.publisher || '不明'}
            publishDate={book.publishedDate}
            imageUrl={
              'https://shop.r10s.jp/book/cabinet/9163/9784297129163_1_4.jpg'
            }
            price={1500}
          />
        ))}
      </div>

      {totalItems > 0 && (
        <Pagination className="mt-8">
          <PaginationContent>
            {currentPage > 1 && (
              <>
                <PaginationItem>
                  <PaginationFirst
                    className="rounded-md bg-white px-3 py-2"
                    onClick={() => handlePageChange(1)}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationPrevious
                    className="rounded-md bg-white px-3 py-2"
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                  />
                </PaginationItem>
              </>
            )}
            <PaginationItem className="mx-4">
              <span>{currentPage}</span>
            </PaginationItem>
            {currentPage < totalPages && (
              <>
                <PaginationItem>
                  <PaginationNext
                    className="rounded-md bg-white px-3 py-2"
                    onClick={() => handlePageChange(currentPage + 1)}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLast
                    className="rounded-md bg-white px-3 py-2"
                    onClick={() => handlePageChange(totalPages)}
                  />
                </PaginationItem>
              </>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </DefaultLayout>
  );
};

export default SearchPage;
