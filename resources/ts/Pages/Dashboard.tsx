import MemoCard from '@/Components/Memo/MemoCard';
import DefaultLayout from '@/Layouts/DefaultLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
  const sampleBook = {
    id: 'b1',
    title: 'サンプルブック',
    author: '山田太郎',
    coverUrl: 'https://shop.r10s.jp/book/cabinet/9163/9784297129163_1_4.jpg',
  };
  return (
    <DefaultLayout header="ダッシュボード">
      <Head title="Dashboard" />

      <div className="rounded-sm border border-green-600 bg-white shadow-md">
        <h2 className="px-2 py-2 text-xl font-semibold md:px-4 md:py-4 md:text-2xl">
          最近書いたメモ
        </h2>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-4">
        <MemoCard
          id="3"
          contents={[
            'サンプルコンテンツ7サンプルコンテンツ7サンプルコンテンツ7サンプルコンテンツ7サンプルコンテンツ7サンプルコンテンツ7サンプルコンテンツ7サンプルコンテンツ7サンプルコンテンツ7サンプルコンテンツ7サンプルコンテンツ7サンプルコンテンツ7サンプルコンテンツ7サンプルコンテンツ7',
            'サンプルコンテンツ8サンプルコンテンツ8サンプルコンテンツ8サンプルコンテンツ8サンプルコンテンツ8サンプルコンテンツ8サンプルコンテンツ8サンプルコンテンツ8サンプルコンテンツ8サンプルコンテンツ8サンプルコンテンツ8サンプルコンテンツ8サンプルコンテンツ8',
            'サンプルコンテンツ9サンプルコンテンツ9サンプルコンテンツ9サンプルコンテンツ9サンプルコンテンツ9サンプルコンテンツ9サンプルコンテンツ9サンプルコンテンツ9サンプルコンテンツ9サンプルコンテンツ9サンプルコンテンツ9サンプルコンテンツ9',
          ]}
          createdAt="2024-02-02T10:00:00Z"
          book={sampleBook}
        />
      </div>
    </DefaultLayout>
  );
}
