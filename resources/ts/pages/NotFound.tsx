import { Button } from '@/components/common/ui/button';
import DefaultLayout from '@/layouts/DefaultLayout';
import { Head, Link } from '@inertiajs/react';
import { FileQuestion } from 'lucide-react';

/**
 * 404エラーページ
 * ページが見つからない場合に表示する
 */
export default function NotFound() {
  return (
    <DefaultLayout>
      <Head title="404 - ページが見つかりません | MineLibrary" />

      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-8 rounded-full bg-red-100 p-6">
          <FileQuestion className="h-16 w-16 text-red-600" />
        </div>

        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          404
        </h1>

        <h2 className="mb-6 text-2xl font-bold text-gray-800">
          ページが見つかりません
        </h2>

        <p className="mb-8 max-w-md text-lg text-gray-600">
          お探しのページは存在しないか、移動または削除された可能性があります。
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
            onClick={() => window.history.back()}
          >
            前のページに戻る
          </Button>
        </div>
      </div>
    </DefaultLayout>
  );
}
