import BookShelfDescription from '@/Components/BookShelf/BookShelfDescription';
import DefaultLayout from '@/Layouts/DefaultLayout';
import { Head } from '@inertiajs/react';

export default function BookShelfDetail() {
  return (
    <DefaultLayout header="FavoriteBookList">
      <Head title="FavoriteBookList" />

      <div className="rounded-sm border border-green-600 bg-white shadow-md">
        <h2 className="px-2 py-2 text-xl font-semibold md:px-4 md:py-4 md:text-2xl">
          BookShelfDetail
        </h2>
      </div>

      <BookShelfDescription />

      <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-4 lg:grid-cols-3"></div>
    </DefaultLayout>
  );
}
