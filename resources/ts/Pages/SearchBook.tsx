import BookCard from '@/Components/Book/BookCard';
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
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { BookProps } from '@/types';

// 楽天APIのレスポンス構造に合わせてインターフェースを修正
interface Book {
  Item: BookProps;
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
  const { results, totalItems, filters } = usePage().props as unknown as PageProps;
  console.log('Page props:', usePage().props);


  const [searchTerm, setSearchTerm] = useState(filters.keyword || '');
  const [searchMethod, setSearchMethod] = useState<'title' | 'isbn'>(filters.searchMethod || 'title');
  const [genre, setGenre] = useState('001');
  const [sortBy, setSortBy] = useState('standard');
  const [currentPage, setCurrentPage] = useState(filters.page || 1);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 9;
  const totalPages = Math.ceil(totalItems / itemsPerPage);


  const searchBooks = () => {
    setLoading(true);
    router.get('/searchbook', {
      keyword: searchTerm,
      page: currentPage,
      genre: genre,
      sort: sortBy,
      searchMethod: searchMethod,
    }, {
      preserveState: true,
      preserveScroll: true,
      only: ['results', 'totalItems', 'filters'],
      onFinish: () => setLoading(false),
    });
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

        <Select value={genre} onValueChange={setGenre}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="ジャンル" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="001">すべてのジャンル</SelectItem>
            <SelectItem value="001002">語学・学習参考書</SelectItem>
            <SelectItem value="001004">小説・エッセイ</SelectItem>
            <SelectItem value="001005">パソコン・システム開発</SelectItem>
            <SelectItem value="001006">ビジネス・経済・就職</SelectItem>
            <SelectItem value="001012">科学・技術</SelectItem>
            <SelectItem value="001016">資格・検定</SelectItem>
            <SelectItem value="001008">人文・思想・社会</SelectItem>
            <SelectItem value="001007">旅行・留学・アウトドア</SelectItem>
            <SelectItem value="001009">ホビー・スポーツ・美術</SelectItem>
            <SelectItem value="001010">美容・暮らし・健康・料理</SelectItem>
            <SelectItem value="001011">エンタメ・ゲーム</SelectItem>
            <SelectItem value="001013">写真集・タレント</SelectItem>
            <SelectItem value="001003">絵本・児童書・図鑑</SelectItem>
            <SelectItem value="001017">ライトノベル</SelectItem>
            <SelectItem value="001019">文庫</SelectItem>
            <SelectItem value="001001">漫画（コミック）</SelectItem>
            <SelectItem value="001028">医学・薬学・看護学・歯科学</SelectItem>
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
            <SelectItem value="standard">標準</SelectItem>
            <SelectItem value="sales">売れている順</SelectItem>
            <SelectItem value="-releaseDate">発売日が新しい順</SelectItem>
            <SelectItem value="+releaseDate">発売日が古い順</SelectItem>
            <SelectItem value="+itemPrice">価格が安い順</SelectItem>
            <SelectItem value="-itemPrice">価格が高い順</SelectItem>
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
              publisherName={item.Item.publisherName || ''}
              salesDate={item.Item.salesDate}
              largeImageUrl={item.Item.largeImageUrl || ''}
              itemPrice={item.Item.itemPrice || 0}
              isbn={item.Item.isbn}
              itemCaption={item.Item.itemCaption || '説明はありません。'}
            />
          ))
        ) : (
          <p>検索結果がありません。</p>
        )}
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
                      handlePageChange(Math.max(1, Number(currentPage) - 1))
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
                    onClick={() => handlePageChange(Number(currentPage) + 1)}
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
