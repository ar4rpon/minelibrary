import DefaultLayout from '@/components/common/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/ui/card';
import { ReadStatusBadge } from '@/components/book/ReadStatusBadge';
import { PageProps, ReadStatus } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { BookOpen, Bookmark, User } from 'lucide-react';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  profile_image?: string;
  profile_message?: string;
}

interface RecentMemo {
  id: number;
  memo: string;
  memo_chapter?: number;
  memo_page?: number;
  created_at: string;
  book: {
    isbn: string;
    title: string;
    author: string;
    image_url: string;
  };
}

interface RecentFavorite {
  isbn: string;
  read_status: ReadStatus;
  created_at: string;
  book: {
    title: string;
    author: string;
    image_url: string;
  };
}

interface BookShelf {
  id: number;
  name: string;
  description: string;
  is_public: boolean;
  created_at: string;
  book_count: number;
}

/**
 * ユーザープロフィールページ
 * ユーザー情報、直近のメモ、お気に入り書籍、本棚を表示する
 */
type ShowProps = Record<string, unknown> & {
  user: UserProfile;
  recentMemos: RecentMemo[];
  recentFavorites: RecentFavorite[];
  bookShelves: BookShelf[];
  isOwnProfile: boolean;
};

/**
 * ユーザープロフィールページ
 * ユーザー情報、直近のメモ、お気に入り書籍、本棚を表示する
 */
export default function Show({
  user,
  recentMemos,
  recentFavorites,
  bookShelves,
  isOwnProfile,
  auth,
}: PageProps<ShowProps>) {
  const pageTitle = isOwnProfile ? "マイプロフィール" : `${user.name}さんのプロフィール`;

  return (
    <DefaultLayout header={pageTitle}>
      <Head title={pageTitle} />

      <div className="space-y-8">
        {/* ユーザー情報 */}
        <section className="rounded-sm border border-green-600 bg-white p-6 shadow-md">
          <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-600 md:mb-0">
              {user.profile_image ? (
                <img
                  src={user.profile_image}
                  alt={user.name}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <User className="h-12 w-12" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="mb-2 text-2xl font-semibold text-green-700">{user.name}</h2>
              <p className="mb-4 text-gray-600">{user.email}</p>
              {user.profile_message && (
                <p className="text-gray-700">{user.profile_message}</p>
              )}
              {isOwnProfile && (
                <div className="mt-4">
                  <Link
                    href={route('profile.edit')}
                    className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    プロフィールを編集
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 直近のメモ */}
        <section>
          <div className="mb-4 flex items-center justify-between rounded-sm border border-green-600 bg-white px-4 py-3 shadow-md">
            <h2 className="text-xl font-semibold text-green-700">直近のメモ</h2>
            {isOwnProfile && (
              <Link
                href={route('memos.index')}
                className="text-sm font-medium text-green-600 hover:text-green-700"
              >
                すべて見る
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentMemos.length > 0 ? (
              recentMemos.map((memo) => (
                <Card key={memo.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <img
                        src={memo.book.image_url}
                        alt={memo.book.title}
                        className="h-20 w-16 rounded-sm border object-cover"
                      />
                      <div className="flex-1 space-y-1">
                        <h3 className="line-clamp-1 font-medium">{memo.book.title}</h3>
                        <p className="text-xs text-gray-500">{memo.book.author}</p>
                        <p className="line-clamp-2 text-sm">{memo.memo}</p>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            {memo.memo_chapter && `${memo.memo_chapter}章`}
                            {memo.memo_chapter && memo.memo_page && ' | '}
                            {memo.memo_page && `${memo.memo_page}P`}
                          </div>
                          <div className="text-xs text-gray-500">{memo.created_at}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full rounded-md border border-dashed border-gray-300 p-6 text-center">
                <BookOpen className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                <p className="text-gray-500">メモはまだありません</p>
              </div>
            )}
          </div>
        </section>

        {/* お気に入りの本 */}
        <section>
          <div className="mb-4 flex items-center justify-between rounded-sm border border-green-600 bg-white px-4 py-3 shadow-md">
            <h2 className="text-xl font-semibold text-green-700">お気に入りの本</h2>
            {isOwnProfile && (
              <Link
                href={route('favorite.index')}
                className="text-sm font-medium text-green-600 hover:text-green-700"
              >
                すべて見る
              </Link>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {recentFavorites.length > 0 ? (
              recentFavorites.map((favorite) => (
                <Card key={favorite.isbn} className="overflow-hidden">
                  <div className="relative pt-[140%]">
                    <img
                      src={favorite.book.image_url}
                      alt={favorite.book.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    {favorite.read_status && (
                      <ReadStatusBadge status={favorite.read_status} />
                    )}
                  </div>
                  <CardContent className="p-3">
                    <h3 className="line-clamp-1 text-sm font-medium">
                      {favorite.book.title}
                    </h3>
                    <p className="line-clamp-1 text-xs text-gray-500">
                      {favorite.book.author}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full rounded-md border border-dashed border-gray-300 p-6 text-center">
                <Bookmark className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                <p className="text-gray-500">お気に入りの本はまだありません</p>
              </div>
            )}
          </div>
        </section>

        {/* 本棚 */}
        <section>
          <div className="mb-4 flex items-center justify-between rounded-sm border border-green-600 bg-white px-4 py-3 shadow-md">
            <h2 className="text-xl font-semibold text-green-700">本棚</h2>
            {isOwnProfile && (
              <Link
                href={route('book-shelf.list')}
                className="text-sm font-medium text-green-600 hover:text-green-700"
              >
                すべて見る
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {bookShelves.length > 0 ? (
              bookShelves.map((bookShelf) => (
                <Card key={bookShelf.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">{bookShelf.name}</span>
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                        {bookShelf.book_count}冊
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                      {bookShelf.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {bookShelf.created_at}
                      </span>
                      <Link
                        href={route('book-shelf.detail', { book_shelf_id: bookShelf.id })}
                        className="text-sm font-medium text-green-600 hover:text-green-700"
                      >
                        詳細を見る
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full rounded-md border border-dashed border-gray-300 p-6 text-center">
                <BookOpen className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                <p className="text-gray-500">本棚はまだありません</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </DefaultLayout>
  );
}
