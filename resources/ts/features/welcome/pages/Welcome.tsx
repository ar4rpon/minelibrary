import DefaultLayout from '@/components/common/layout';
import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';
import {
  BookHeart,
  BookOpen,
  BookmarkIcon,
  Library,
  NotepadText,
  Search,
  Sparkles,
  Users,
} from 'lucide-react';

/**
 * ウェルカムページ
 * アプリケーションのトップページを表示する
 */
export default function Welcome() {
  return (
    <DefaultLayout>
      <Head title="MineLibrary | あなたの読書体験を豊かに" />

      {/* ヒーローセクション */}
      <div className="relative overflow-hidden bg-gradient-to-b from-green-50 to-white py-16 sm:py-24">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block text-green-600">
                  MineLibrary（マインライブラリー）
                </span>
                <span className="block">あなたの読書体験を豊かに</span>
              </h1>
              <p className="mt-6 max-w-3xl text-xl text-gray-500">
                本の管理から読書記録まで、あなたの読書ライフをサポートするツールです。
                大切な本をいつでもどこでも整理し、読書の楽しみを最大限に引き出します。
              </p>
              <div className="mt-10 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Link href={route('register', {}, false)}>
                  <Button size="lg" className="w-full sm:w-auto">
                    今すぐ始める
                  </Button>
                </Link>
                <Link href={route('login', {}, false)}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    ログイン
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden items-center justify-center md:flex">
              <div className="relative h-[400px] w-[400px] overflow-hidden rounded-lg bg-white shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-50 opacity-50"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-32 w-24 rotate-[-5deg] transform rounded-md bg-white shadow-md">
                      <div className="h-full w-full rounded-md bg-green-600 opacity-80"></div>
                    </div>
                    <div className="h-40 w-28 rotate-[8deg] transform rounded-md bg-white shadow-md">
                      <div className="h-full w-full rounded-md bg-blue-500 opacity-80"></div>
                    </div>
                    <div className="w-26 h-36 rotate-[3deg] transform rounded-md bg-white shadow-md">
                      <div className="h-full w-full rounded-md bg-yellow-500 opacity-80"></div>
                    </div>
                    <div className="w-22 h-28 rotate-[-10deg] transform rounded-md bg-white shadow-md">
                      <div className="h-full w-full rounded-md bg-red-500 opacity-80"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 機能紹介セクション */}
      <div className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              マイライブラリーの主な機能
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-500">
              あなたの読書体験をより豊かにする機能が満載
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* 機能1: 本の検索 */}
            <div className="rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg">
              <div className="mb-4 inline-flex rounded-full bg-green-100 p-3">
                <Search className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900">本の検索</h3>
              <p className="mt-2 text-gray-500">
                タイトル、ISBNから簡単に本を検索。
                欲しい本や読みたい本をすぐに見つけることができます。
              </p>
            </div>

            {/* 機能2: 本棚管理 */}
            <div className="rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg">
              <div className="mb-4 inline-flex rounded-full bg-green-100 p-3">
                <Library className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900">本棚管理</h3>
              <p className="mt-2 text-gray-500">
                複数の本棚を作成して、ジャンルやテーマごとに本を整理。
                あなただけのオリジナル本棚を作りましょう。
              </p>
            </div>

            {/* 機能3: お気に入り登録 */}
            <div className="rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg">
              <div className="mb-4 inline-flex rounded-full bg-green-100 p-3">
                <BookHeart className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900">
                お気に入り登録
              </h3>
              <p className="mt-2 text-gray-500">
                特に気に入った本をお気に入りに登録。
                読書状況（読みたい・読んでる・読んだ）も管理できます。
              </p>
            </div>

            {/* 機能4: 読書メモ */}
            <div className="rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg">
              <div className="mb-4 inline-flex rounded-full bg-green-100 p-3">
                <NotepadText className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900">読書メモ</h3>
              <p className="mt-2 text-gray-500">
                読書中の気づきや感想をメモとして記録。
                あとから振り返ることで、読書体験がより深まります。
              </p>
            </div>

            {/* 機能5: 外部サイト連携 */}
            <div className="rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg">
              <div className="mb-4 inline-flex rounded-full bg-green-100 p-3">
                <BookmarkIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900">
                外部サイト連携
              </h3>
              <p className="mt-2 text-gray-500">
                気になった本があればAmazon、楽天の各リンクからすぐに購入できる
              </p>
            </div>

            {/* 機能6: シンプルな操作性 */}
            <div className="rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg">
              <div className="mb-4 inline-flex rounded-full bg-green-100 p-3">
                <Sparkles className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900">
                シンプルな操作性
              </h3>
              <p className="mt-2 text-gray-500">
                読書に集中できる、シンプルな設計を目指しました。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ユーザーターゲットセクション */}
      <div className="bg-green-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              こんな方におすすめ
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-500">
              マイライブラリーは、あらゆる読書好きのためのアプリです。
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* ターゲット1 */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4 flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-center text-xl font-medium text-gray-900">
                読書好きの方
              </h3>
              <p className="mt-2 text-center text-gray-500">
                たくさんの本を読む方に。読書記録を簡単に管理し、読書体験をより豊かにします。
              </p>
            </div>

            {/* ターゲット2 */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4 flex items-center justify-center">
                <Library className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-center text-xl font-medium text-gray-900">
                本のコレクターの方
              </h3>
              <p className="mt-2 text-center text-gray-500">
                大切な蔵書を整理したい方に。ジャンルや著者ごとに本棚を作成し、コレクションを管理できます。
              </p>
            </div>

            {/* ターゲット3 */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4 flex items-center justify-center">
                <Users className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-center text-xl font-medium text-gray-900">
                読書習慣を身につけたい方
              </h3>
              <p className="mt-2 text-center text-gray-500">
                読書の習慣化を目指す方に。読書状況の管理機能で、継続的な読書をサポートします。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTAセクション */}
      <div className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-green-600 px-6 py-16 sm:p-16">
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                あなたの読書ライフを始めましょう
              </h2>
              <p className="mt-4 text-lg text-green-100">
                マイライブラリーで、読書体験をもっと豊かに、もっと便利に。
                無料でアカウントを作成して、今すぐ始めましょう。
              </p>
              <div className="mt-8 flex justify-center">
                <Link href={route('register', {}, false)}>
                  <Button
                    size="lg"
                    className="bg-white text-green-600 hover:bg-green-50"
                  >
                    無料で始める
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
