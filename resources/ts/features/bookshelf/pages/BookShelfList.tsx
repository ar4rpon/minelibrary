import BookShelf from '@/components/bookshelf';
import CommonPagination from '@/components/common/CommonPagination';
import DefaultLayout from '@/components/common/layout';
import { Button } from '@/components/common/ui/button';
import { Input } from '@/components/common/ui/input';
import { CreateBookShelfDialog } from '@/features/bookshelf/components/dialogs/CreateBookShelfDialog';
import { BookShelfBase } from '@/types/bookShelf';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';

// 本棚の型定義
type BookShelf = BookShelfBase & { image?: string };

// 初期モックデータ（APIが実装されるまでの仮データ）
const initialBookShelves: BookShelf[] = [
  {
    bookShelfId: 11,
    name: '技術書コレクション',
    description: 'プログラミングや技術関連の本をまとめた本棚です。',
    isPublic: true,
    image: 'https://shop.r10s.jp/book/cabinet/0285/9784798070285_1_4.jpg',
  },
  {
    bookShelfId: 2,
    name: '小説コレクション',
    description: '好きな小説をまとめた本棚です。',
    isPublic: true,
    image: 'https://placehold.jp/150x200.png',
  },
  {
    bookShelfId: 3,
    name: '勉強用資料',
    description: '資格取得のための参考書や勉強資料をまとめた本棚です。',
    isPublic: false,
    image: 'https://placehold.jp/150x200.png',
  },
  {
    bookShelfId: 4,
    name: 'お気に入りの漫画',
    description: 'お気に入りの漫画シリーズをまとめた本棚です。',
    isPublic: true,
    image: 'https://placehold.jp/150x200.png',
  },
];

/**
 * 本棚一覧ページ
 * ユーザーの本棚一覧を表示し、検索や作成機能を提供する
 */
export default function BookShelfList() {
  // 状態管理
  const [bookShelves, setBookShelves] =
    useState<BookShelf[]>(initialBookShelves);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 5; // 1ページあたりの表示数

  // 本棚一覧を取得する関数（APIが実装されたら有効化）
  const fetchBookShelves = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // APIが実装されたら以下のコメントを解除
      // const response = await axios.get('/api/book-shelves');
      // setBookShelves(response.data);
      // モック用のタイムアウト（APIが実装されたら削除）
      // await new Promise(resolve => setTimeout(resolve, 1000));
      // setBookShelves(initialBookShelves);
    } catch (error) {
      console.error('本棚一覧の取得に失敗しました:', error);
      setError('本棚一覧の取得に失敗しました。再読み込みしてください。');
    } finally {
      setIsLoading(false);
    }
  };

  // コンポーネントマウント時にデータを取得（APIが実装されたら有効化）
  // useEffect(() => {
  //   fetchBookShelves();
  // }, []);

  // 検索フィルター
  const filteredBookShelves = bookShelves.filter(
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

  // 新しい本棚作成ダイアログを開く
  const handleCreate = () => {
    setCreateDialogOpen(true);
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

    setIsCreating(true);

    try {
      const response = await axios.post(`/book-shelf/create`, {
        book_shelf_name: bookShelfName,
        description: description,
      });

      console.log('本棚作成成功:', response.data);

      // 成功したらページをリロード（APIが実装されたら有効化）
      // router.reload();

      // 新しい本棚を追加（APIが実装されるまでの仮実装）
      const newBookShelf: BookShelf = {
        bookShelfId: Math.max(...bookShelves.map((b) => b.bookShelfId)) + 1,
        name: bookShelfName,
        description: description,
        isPublic: true,
        image: 'https://placehold.jp/150x200.png',
      };

      // 状態を更新して新しい本棚を追加
      setBookShelves([newBookShelf, ...bookShelves]);

      // 1ページ目に戻す
      setCurrentPage(1);

      // ダイアログを閉じる
      setCreateDialogOpen(false);
    } catch (error) {
      console.error('本棚作成エラー:', error);
      alert('本棚の作成に失敗しました。もう一度お試しください。');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <DefaultLayout header="本棚一覧">
      <Head title="本棚一覧" />

      {/* 検索と作成ボタン */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="本棚を検索..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button className="w-full md:w-auto" onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          新しい本棚を作成する
        </Button>
      </div>

      {/* 本棚一覧 */}
      {error ? (
        // エラー状態
        <div className="mt-12 flex flex-col items-center justify-center rounded-lg border border-dashed border-red-300 bg-red-50 p-12 text-center">
          <div className="mb-4 rounded-full bg-red-100 p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
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
              xmlns="http://www.w3.org/2000/svg"
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
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-12 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <div className="mb-4 rounded-full bg-gray-100 p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
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
              : '本棚がまだありません'}
          </h3>
          <p className="mb-6 text-sm text-gray-500">
            {searchQuery
              ? '検索条件を変更して再度お試しください'
              : '「新しい本棚を作成する」ボタンから、あなたの最初の本棚を作成しましょう'}
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
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            新しい本棚を作成する
          </Button>
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
        isOpen={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onCreateBookShelfConfirm={confirmBookShelfCreate}
        isLoading={isCreating}
      />
    </DefaultLayout>
  );
}
