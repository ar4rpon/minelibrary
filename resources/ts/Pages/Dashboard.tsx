import BookCard from '@/Components/BookCard';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Dashboard
        </h2>
      }
    >
      <Head title="Dashboard" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">You're logged in!</div>
          </div>

          <div className="mt-8 grid gap-x-8 gap-y-4 lg:grid-cols-3">
            <BookCard
              title="本のタイトル"
              author="著者名"
              publisher="出版社"
              publishDate="2024年2月2日"
              price={1500}
              imageUrl="https://shop.r10s.jp/book/cabinet/9163/9784297129163_1_4.jpg"
            />

            <BookCard
              title="本のタイトル"
              author="著者名"
              publisher="出版社"
              publishDate="2024年2月2日"
              price={1500}
              imageUrl="https://shop.r10s.jp/book/cabinet/9163/9784297129163_1_4.jpg"
            />

            <BookCard
              title="本のタイトル"
              author="著者名"
              publisher="出版社"
              publishDate="2024年2月2日"
              price={15000}
              imageUrl="https://shop.r10s.jp/book/cabinet/9163/9784297129163_1_4.jpg"
            />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
