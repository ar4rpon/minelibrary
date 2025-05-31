import DefaultLayout from '@/layouts/DefaultLayout';
import { Button } from '@/components/common/ui/button';
import { Card, CardContent } from '@/components/common/ui/card';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { BookOpen, Heart, User } from 'lucide-react';
import { useState } from 'react';

// 本の型定義
interface Book {
  isbn: string;
  book: {
    title: string;
    author: string;
    publisher_name: string;
    sales_date: string;
    image_url: string;
    item_caption: string;
    item_price: number;
  };
}

// 本棚の型定義
interface BookShelf {
  id: number;
  name: string;
  description: string;
  isPublic: boolean;
  isFavorited: boolean;
}

// ユーザー情報の型定義
interface UserInfo {
  id: number;
  name: string;
}

// プロパティの型定義
interface Props {
  user: UserInfo;
  bookShelf: BookShelf;
  books: Book[];
}

/**
 * 他ユーザーの本棚詳細ページ
 * 特定ユーザーの特定の公開本棚の詳細を表示する
 */
export default function UserBookShelfDetail({
  user,
  bookShelf,
  books = [],
}: Props) {
  // 状態管理
  const [isFavorited, setIsFavorited] = useState(bookShelf.isFavorited);
  const [isProcessing, setIsProcessing] = useState(false);

  // お気に入り状態を切り替える
  const toggleFavorite = async () => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      const response = await axios.post(route('book-shelf-favorite.toggle'), {
        book_shelf_id: bookShelf.id,
      });

      setIsFavorited(response.data.is_favorited);
    } catch (error) {
      console.error('お気に入り処理に失敗しました', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <DefaultLayout header={`${bookShelf.name}`}>
      <Head title={`${bookShelf.name} - ${user.name}さんの本棚`} />

      {/* 本棚情報 */}
      <div className="mb-6 rounded-sm border border-green-600 bg-white p-6 shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-green-700">
                {bookShelf.name}
              </h2>
              <p className="text-sm text-gray-600">{user.name}さんの本棚</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFavorite}
            disabled={isProcessing}
            className={`flex items-center ${
              isFavorited
                ? 'border-red-200 bg-red-50 text-red-500 hover:bg-red-100'
                : ''
            }`}
          >
            <Heart
              className={`mr-1 h-4 w-4 ${isFavorited ? 'fill-current' : ''}`}
            />
            {isFavorited ? 'お気に入り済み' : 'お気に入りに追加'}
          </Button>
        </div>
        <p className="text-gray-700">{bookShelf.description}</p>
      </div>

      {/* 本一覧 */}
      <div className="mb-4 flex items-center justify-between rounded-sm border border-green-600 bg-white px-4 py-3 shadow-md">
        <h2 className="text-xl font-semibold text-green-700">本一覧</h2>
        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
          {books.length}冊
        </span>
      </div>

      {books.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {books.map((item) => (
            <Card key={item.isbn} className="overflow-hidden">
              <div className="relative pt-[140%]">
                <img
                  src={item.book.image_url}
                  alt={item.book.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <CardContent className="p-3">
                <h3 className="line-clamp-1 text-sm font-medium">
                  {item.book.title}
                </h3>
                <p className="line-clamp-1 text-xs text-gray-500">
                  {item.book.author}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="mt-12 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <div className="mb-4 rounded-full bg-gray-100 p-3">
            <BookOpen className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            本棚に本がありません
          </h3>
          <p className="text-sm text-gray-500">
            この本棚にはまだ本が追加されていません
          </p>
        </div>
      )}
    </DefaultLayout>
  );
}
