import { BookShelfService } from '@/api/services';
import CommonPagination from '@/components/common/CommonPagination';
import DefaultLayout from '@/components/common/layout';
import { BookShelfDefaultCard } from '@/components/domain/bookshelf';
import { CreateBookShelfDialog } from '@/components/domain/bookshelf/dialogs/CreateBookShelfDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDialogStateWithLoading } from '@/hooks/common/useDialogState';
import type { BookShelfData } from '@/types/api';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { BookOpen, Heart, Plus, Search, User } from 'lucide-react';
import { useEffect, useState } from 'react';

// 本棚の型定義
type BookShelf = BookShelfData & {
  image?: string;
  type?: 'my' | 'favorite';
  owner?: {
    id: number;
    name: string;
  };
};

// プロパティの型定義
interface Props {
  initialBookShelves?: {
    my: BookShelf[];
    favorite: BookShelf[];
  };
}

/**
 * 本棚一覧ページ
 * ユーザーの本棚一覧を表示し、検索や作成機能を提供する
 */
export default function BookShelfList({
  initialBookShelves = { my: [], favorite: [] },
}: Props) {
  // 状態管理
  const [myBookShelves, setMyBookShelves] = useState<BookShelf[]>(
    initialBookShelves.my,
  );
  const [favoriteBookShelves, setFavoriteBookShelves] = useState<BookShelf[]>(
    initialBookShelves.favorite,
  );
  const [activeTab, setActiveTab] = useState<'my' | 'favorite'>('my');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 統一されたダイアログ状態管理
  const createDialog = useDialogStateWithLoading();
  const itemsPerPage = 5; // 1ページあたりの表示数

  // 本棚一覧を取得する関数
  const fetchBookShelves = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await BookShelfService.getAllBookShelves();
      if (data.my && data.favorite) {
        // BookShelfDataをBookShelf型に変換
        const convertedMy: BookShelf[] = data.my.map((item) => ({
          ...item,
          type: 'my' as const,
        }));
        const convertedFavorite: BookShelf[] = data.favorite.map((item) => ({
          ...item,
          type: 'favorite' as const,
        }));
        setMyBookShelves(convertedMy);
        setFavoriteBookShelves(convertedFavorite);
      } else {
        // 旧形式のデータの場合（後方互換性のため）
        const converted = Array.isArray(data)
          ? data.map((item) => ({ ...item, type: 'my' as const }))
          : [];
        setMyBookShelves(converted);
      }
    } catch (error) {
      console.error('本棚一覧の取得に失敗しました:', error);
      setError('本棚一覧の取得に失敗しました。再読み込みしてください。');
    } finally {
      setIsLoading(false);
    }
  };

  // コンポーネントマウント時にデータを取得
  useEffect(() => {
    // 初期データが空の場合のみAPIから取得
    if (
      initialBookShelves.my.length === 0 &&
      initialBookShelves.favorite.length === 0
    ) {
      fetchBookShelves();
    }
  }, [initialBookShelves.my.length, initialBookShelves.favorite.length]);

  // 表示する本棚を選択
  const displayBookShelves =
    activeTab === 'my' ? myBookShelves : favoriteBookShelves;

  // 検索フィルター
  const filteredBookShelves = displayBookShelves.filter(
    (bookShelf) =>
      bookShelf.book_shelf_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (bookShelf.description || '')
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  // ページネーション
  const totalPages = Math.ceil(filteredBookShelves.length / itemsPerPage);
  const paginatedBookShelves = filteredBookShelves.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // タブ切り替え
  const handleTabChange = (tab: 'my' | 'favorite') => {
    setActiveTab(tab);
    setCurrentPage(1); // タブ切り替え時にページを1に戻す
    setSearchQuery(''); // 検索条件もクリア
  };

  // 新しい本棚作成ダイアログを開く
  const handleCreate = () => {
    createDialog.open();
  };

  // 本棚作成の確認処理
  const confirmBookShelfCreate = async (
    bookShelfName: string,
    description: string,
  ) => {
    if (!bookShelfName.trim()) {
      alert('本棚名を入力してください');
      return;
    }

    createDialog.setLoading(true);

    try {
      const response = await axios.post(`/book-shelf/create`, {
        book_shelf_name: bookShelfName,
        description: description,
      });
      console.log('本棚作成成功:', response.data);

      // 成功したらページをリロード
      router.reload();

      // 1ページ目に戻す
      setCurrentPage(1);

      // ダイアログを閉じる
      createDialog.close();
    } catch (error) {
      console.error('本棚作成エラー:', error);
      alert('本棚の作成に失敗しました。もう一度お試しください。');
    } finally {
      createDialog.setLoading(false);
    }
  };

  return (
    <DefaultLayout header="本棚一覧">
      <Head title="本棚一覧" />

      {/* タブと検索・作成ボタン */}
      <div className="mb-6 space-y-4">
        <Tabs
          defaultValue="my"
          value={activeTab}
          onValueChange={(value: string) =>
            handleTabChange(value as 'my' | 'favorite')
          }
        >
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="my" className="flex-1 sm:flex-auto">
              <BookOpen className="mr-2 h-4 w-4" />
              自分の本棚
            </TabsTrigger>
            <TabsTrigger value="favorite" className="flex-1 sm:flex-auto">
              <Heart className="mr-2 h-4 w-4" />
              お気に入り本棚
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="本棚を検索..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {activeTab === 'my' && (
            <Button className="w-full md:w-auto" onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              新しい本棚を作成する
            </Button>
          )}
        </div>
      </div>

      {/* 本棚一覧 */}
      {error ? (
        // エラー状態
        <div className="mt-12 flex flex-col items-center justify-center rounded-lg border border-dashed border-red-300 bg-red-50 p-12 text-center">
          <div className="mb-4 rounded-full bg-red-100 p-3">
            <svg
              xmlns="https://www.w3.org/2000/svg"
              className="h-10 w-10 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-medium text-red-900">{error}</h3>
          <Button onClick={() => fetchBookShelves()} className="mt-4">
            再読み込み
          </Button>
        </div>
      ) : isLoading ? (
        // ローディング状態
        <div className="mt-12 flex flex-col items-center justify-center p-12 text-center">
          <div className="mb-4 rounded-full bg-gray-100 p-3">
            <svg
              className="h-10 w-10 animate-spin text-green-600"
              xmlns="https://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            本棚を読み込み中...
          </h3>
        </div>
      ) : paginatedBookShelves.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-8 gap-y-6">
          {paginatedBookShelves.map((bookShelf) => (
            <div
              key={bookShelf.id}
              className="transition-all duration-200 hover:translate-x-1"
            >
              {activeTab === 'favorite' && bookShelf.owner ? (
                <div className="mb-2 flex items-center text-sm text-gray-600">
                  <User className="mr-1 h-4 w-4" />
                  <span>{bookShelf.owner.name}さんの本棚</span>
                </div>
              ) : null}
              <BookShelfDefaultCard
                bookShelfId={bookShelf.id}
                name={bookShelf.book_shelf_name}
                description={bookShelf.description || ''}
                isPublic={bookShelf.is_public}
                image={bookShelf.image}
                owner={bookShelf.owner}
                type={activeTab}
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
              : activeTab === 'my'
                ? '本棚がまだありません'
                : 'お気に入りの本棚がまだありません'}
          </h3>
          <p className="mb-6 text-sm text-gray-500">
            {searchQuery
              ? '検索条件を変更して再度お試しください'
              : activeTab === 'my'
                ? '「新しい本棚を作成する」ボタンから、あなたの最初の本棚を作成しましょう'
                : '他のユーザーの本棚をお気に入りに追加すると、ここに表示されます'}
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
          {activeTab === 'my' && (
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              新しい本棚を作成する
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

      {/* 本棚作成ダイアログ */}
      <CreateBookShelfDialog
        isOpen={createDialog.isOpen}
        onClose={createDialog.close}
        onCreateBookShelfConfirm={confirmBookShelfCreate}
        isLoading={createDialog.isLoading}
      />
    </DefaultLayout>
  );
}
