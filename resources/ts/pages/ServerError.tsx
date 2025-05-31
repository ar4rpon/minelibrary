import { DefaultLayout } from '@/components/common/layout';
import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';
import { ServerCrash } from 'lucide-react';

/**
 * 500エラーページ
 * サーバーエラーが発生した場合に表示する
 */
export default function ServerError() {
  return (
    <DefaultLayout>
      <Head title="500 - サーバーエラー | MineLibrary" />

      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-8 rounded-full bg-amber-100 p-6">
          <ServerCrash className="h-16 w-16 text-amber-600" />
        </div>

        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          500
        </h1>

        <h2 className="mb-6 text-2xl font-bold text-gray-800">
          サーバーエラーが発生しました
        </h2>

        <p className="mb-8 max-w-md text-lg text-gray-600">
          申し訳ありませんが、サーバーで問題が発生しました。しばらく経ってからもう一度お試しください。
        </p>

        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto">
              トップページに戻る
            </Button>
          </Link>

          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => window.location.reload()}
          >
            ページを再読み込み
          </Button>
        </div>
      </div>
    </DefaultLayout>
  );
}
