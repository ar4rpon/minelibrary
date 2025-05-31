import { Card } from '@/components/common/ui/card';
import DeleteUserForm from '@/components/domain/profile/DeleteUserForm';
import UpdatePasswordForm from '@/components/domain/profile/UpdatePasswordForm';
import UpdateProfileInformationForm from '@/components/domain/profile/UpdateProfileInformationForm';
import DefaultLayout from '@/layouts/DefaultLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';

/**
 * プロフィール編集ページ
 * ユーザー情報の編集、パスワード変更、アカウント削除機能を提供する
 */
export default function Edit({
  mustVerifyEmail,
  status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
  return (
    <DefaultLayout header="プロフィール編集">
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
    </DefaultLayout>
  );
}
