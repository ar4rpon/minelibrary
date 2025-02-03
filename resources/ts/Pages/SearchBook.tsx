import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function SearchBook() {
  return (
    <AuthenticatedLayout header="SearchBook">
      <Head title="SearchBook" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-sm border border-green-600 bg-white shadow-md">
            <h2 className="px-2 py-2 text-xl font-semibold md:px-4 md:py-4 md:text-2xl">
              SearchBook
            </h2>
          </div>
          <div className="mt-8">main content</div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
