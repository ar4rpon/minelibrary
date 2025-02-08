import { Card } from '@/Components/ui/card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({
  mustVerifyEmail,
  status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
  return (
    <AuthenticatedLayout header="プロフィール編集">
      <Head title="プロフィール編集" />
      <div>
        <div className="mb-4 rounded-sm border border-green-600 bg-white shadow-md">
          <p className="px-2 py-2 text-xl font-semibold md:px-4 md:py-4 md:text-2xl">
            プロフィール変更
          </p>
        </div>
        <Card className="p-6 shadow-lg">
          <UpdateProfileInformationForm
            mustVerifyEmail={mustVerifyEmail}
            status={status}
          />
        </Card>
      </div>
      <div className="mt-8">
        <div className="mb-4 rounded-sm border border-green-600 bg-white shadow-md">
          <p className="px-2 py-2 text-xl font-semibold md:px-4 md:py-4 md:text-2xl">
            パスワード変更
          </p>
        </div>
        <Card className="p-6 shadow-lg">
          <UpdatePasswordForm />
        </Card>
      </div>
      <div className="mt-8">
        <div className="mb-4 rounded-sm border border-green-600 bg-white shadow-md">
          <p className="px-2 py-2 text-xl font-semibold md:px-4 md:py-4 md:text-2xl">
            アカウント削除
          </p>
        </div>
        <Card className="p-6 shadow-lg">
          <DeleteUserForm />
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
