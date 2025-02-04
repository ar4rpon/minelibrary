import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { BaseDialog } from '@/Dialog/BaseDialog';

export default function BookShelfList() {
  return (
    <AuthenticatedLayout header="BookShelfList">
      <Head title="BookShelfList" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-sm border border-green-600 bg-white shadow-md">
            <h2 className="px-2 py-2 text-xl font-semibold md:px-4 md:py-4 md:text-2xl">
              お気に入り本一覧
            </h2>
          </div>
          <div className="mt-8">
            <BaseDialog />

          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
