import CommonPagination from '@/components/common/CommonPagination';
import { Button } from '@/components/common/ui/button';
import { Input } from '@/components/common/ui/input';
import BookShelf from '@/components/domain/bookshelf';
import DefaultLayout from '@/layouts/DefaultLayout';
import { BookShelfBase } from '@/types/bookShelf';
import { Head } from '@inertiajs/react';
import { Search, User } from 'lucide-react';
import { useState } from 'react';

// 本棚の型定義
type BookShelf = BookShelfBase & {
  image?: string;
  bookCount?: number;
};

// ユーザー情報の型定義
interface UserInfo {
  id: number;
  name: string;
}

// プロパティの型定義
interface Props {
  user: UserInfo;
  bookshelves: BookShelf[];
}

/**
 * 他ユーザーの本棚一覧ページ
 * 特定ユーザーの公開本棚一覧を表示する
 */
export default function UserBookShelfList({ user, bookshelves = [] }: Props) {
  // 状態管理
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // 1ページあたりの表示数

  // 検索フィルター
  const filteredBookShelves = bookshelves.filter(
    (bookShelf) =>
      bookShelf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookShelf.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // ページネーション
  const totalPages = Math.ceil(filteredBookShelves.length / itemsPerPage);
  const paginatedBookShelves = filteredBookShelves.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <DefaultLayout header={`${user.name}さんの本棚一覧`}>
      <Head title={`${user.name}さんの本棚一覧`} />

      {/* ユーザー情報 */}
      <div className="mb-6 flex items-center rounded-sm border border-green-600 bg-white p-4 shadow-md">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
          <User className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <h2 className="text-xl font-semibold text-green-700">
            {user.name}さんの本棚
          </h2>
          <p className="text-sm text-gray-600">
            公開されている本棚のみ表示しています
          </p>
        </div>
      </div>

      {/* 検索 */}
      <div className="mb-6">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="本棚を検索..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* 本棚一覧 */}
      {paginatedBookShelves.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-8 gap-y-6">
          {paginatedBookShelves.map((bookShelf) => (
            <div
              key={bookShelf.bookShelfId}
              className="transition-all duration-200 hover:translate-x-1"
            >
              <BookShelf
                variant="card"
                bookShelfId={bookShelf.bookShelfId}
                name={bookShelf.name}
                description={bookShelf.description}
                isPublic={bookShelf.isPublic}
                image={bookShelf.image}
                userName={user.name}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-12 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <div className="mb-4 rounded-full bg-gray-100 p-3">
            <svg
              xmlns="https://www.w3.org/2000/svg"
              className="h-10 w-10 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            {searchQuery
              ? '検索条件に一致する本棚が見つかりませんでした'
              : '公開されている本棚がありません'}
          </h3>
          <p className="mb-6 text-sm text-gray-500">
            {searchQuery
              ? '検索条件を変更して再度お試しください'
              : `${user.name}さんはまだ公開している本棚がありません`}
          </p>
          {searchQuery && (
            <Button
              variant="outline"
              onClick={() => setSearchQuery('')}
              className="mb-2"
            >
              検索条件をクリア
            </Button>
          )}
        </div>
      )}

      {/* ページネーション */}
      {filteredBookShelves.length > itemsPerPage && (
        <div className="mt-8">
          <CommonPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredBookShelves.length}
            handlePageChange={setCurrentPage}
          />
        </div>
      )}
    </DefaultLayout>
  );
}
