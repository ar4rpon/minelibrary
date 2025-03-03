import DefaultLayout from '@/components/common/layout';
import { Head, Link } from '@inertiajs/react';

/**
 * アプリ使用方法ページ
 * MineLibraryの使い方を説明するページ
 */
export default function Dashboard() {
  return (
    <DefaultLayout header="アプリの使い方">
      <Head title="アプリの使い方" />

      <div className="space-y-8">
        {/* アプリ概要 */}
        <section className="rounded-sm border border-green-600 bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-green-700">MineLibraryへようこそ</h2>
          <p className="text-gray-700">
            MineLibraryは、あなたの読書体験を豊かにするための本棚管理アプリです。
            お気に入りの本を整理し、メモを残し、友達と共有することができます。
          </p>
        </section>

        {/* 主な機能 */}
        <section className="rounded-sm border border-green-600 bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-green-700">主な機能</h2>

          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="md:w-3/4">
                <h3 className="mb-2 text-xl font-medium text-green-600">📚 本棚の作成と管理</h3>
                <p className="text-gray-700">
                  複数の本棚を作成して、ジャンルやテーマごとに本を整理できます。
                  「本棚リスト」から新しい本棚を作成したり、既存の本棚を管理したりできます。
                </p>
              </div>
              <div className="mt-3 md:mt-0">
                <Link
                  href={route('book-shelf.list')}
                  className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  本棚リストへ
                </Link>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="md:w-3/4">
                <h3 className="mb-2 text-xl font-medium text-green-600">🔍 本の検索と追加</h3>
                <p className="text-gray-700">
                  「本を検索」機能を使って、タイトルや著者名から本を検索できます。
                  気に入った本は「お気に入り」に追加したり、本棚に追加したりできます。
                </p>
              </div>
              <div className="mt-3 md:mt-0">
                <Link
                  href={route('book.search')}
                  className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  本を検索する
                </Link>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="md:w-3/4">
                <h3 className="mb-2 text-xl font-medium text-green-600">📝 メモの作成</h3>
                <p className="text-gray-700">
                  本に関するメモを作成して保存できます。読書の感想や重要なポイントを記録しておきましょう。
                  メモは「メモリスト」から一覧で確認できます。
                </p>
              </div>
              <div className="mt-3 md:mt-0">
                <Link
                  href={route('memos.index')}
                  className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  メモリストへ
                </Link>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="md:w-3/4">
                <h3 className="mb-2 text-xl font-medium text-green-600">⭐ お気に入り本の管理</h3>
                <p className="text-gray-700">
                  気に入った本は「お気に入り」に追加して、簡単にアクセスできるようにしましょう。
                  読書状況も管理できるので、読みたい本や読み終わった本を整理するのに便利です。
                </p>
              </div>
              <div className="mt-3 md:mt-0">
                <Link
                  href={route('favorite.index')}
                  className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  お気に入りへ
                </Link>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="md:w-3/4">
                <h3 className="mb-2 text-xl font-medium text-green-600">🔗 本棚の共有</h3>
                <p className="text-gray-700">
                  作成した本棚は共有リンクを生成して、友達や家族と共有することができます。
                  本棚の詳細ページから「共有リンクを生成」を選択してください。
                </p>
              </div>
              <div className="mt-3 md:mt-0">
                <Link
                  href={route('book-shelf.list')}
                  className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  本棚を共有する
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 使い始め方 */}
        <section className="rounded-sm border border-green-600 bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-green-700">使い始め方</h2>

          <ol className="ml-5 list-decimal space-y-3 text-gray-700">
            <li>
              まずは「本を検索」から興味のある本を探してみましょう
              <Link
                href={route('book.search')}
                className="ml-3 inline-flex items-center rounded-md bg-green-600 px-3 py-1 text-xs font-medium text-white shadow-sm hover:bg-green-700"
              >
                検索へ
              </Link>
            </li>
            <li>
              気に入った本は「お気に入り」に追加しておくと便利です
              <Link
                href={route('favorite.index')}
                className="ml-3 inline-flex items-center rounded-md bg-green-600 px-3 py-1 text-xs font-medium text-white shadow-sm hover:bg-green-700"
              >
                お気に入りへ
              </Link>
            </li>
            <li>
              「本棚リスト」から新しい本棚を作成しましょう
              <Link
                href={route('book-shelf.list')}
                className="ml-3 inline-flex items-center rounded-md bg-green-600 px-3 py-1 text-xs font-medium text-white shadow-sm hover:bg-green-700"
              >
                本棚リストへ
              </Link>
            </li>
            <li>本棚に本を追加して、自分だけのコレクションを作りましょう</li>
            <li>
              本に関するメモを残して、読書体験を記録しましょう
              <Link
                href={route('memos.index')}
                className="ml-3 inline-flex items-center rounded-md bg-green-600 px-3 py-1 text-xs font-medium text-white shadow-sm hover:bg-green-700"
              >
                メモリストへ
              </Link>
            </li>
          </ol>
        </section>

        {/* よくある質問 */}
        <section className="rounded-sm border border-green-600 bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-green-700">よくある質問</h2>

          <div className="space-y-4">
            <div>
              <h3 className="mb-1 text-lg font-medium text-green-600">Q: 本の情報はどこから取得していますか？</h3>
              <p className="text-gray-700">
                A: 楽天ブックスAPIから書籍情報を取得しています。検索結果から直接楽天市場ほかAmazonへのリンクも利用できます。
              </p>
            </div>

            <div>
              <h3 className="mb-1 text-lg font-medium text-green-600">Q: 共有リンクの有効期限はありますか？</h3>
              <p className="text-gray-700">
                A: 共有リンクに有効期限はありません。ただし、本棚を削除すると関連する共有リンクも無効になります。
              </p>
            </div>

            <div>
              <h3 className="mb-1 text-lg font-medium text-green-600">Q: アカウント情報の変更方法は？</h3>
              <p className="flex items-center text-gray-700">
                A: 画面右上のユーザーメニューから「プロフィール」を選択すると、アカウント情報の変更ができます。
                <Link
                  href={route('profile.edit')}
                  className="ml-3 inline-flex items-center rounded-md bg-green-600 px-3 py-1 text-xs font-medium text-white shadow-sm hover:bg-green-700"
                >
                  プロフィール設定へ
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </DefaultLayout>
  );
}
