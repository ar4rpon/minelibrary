import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Card } from '@/Components/ui/card';

export default function Edit({
  mustVerifyEmail,
  status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
  return (
    <AuthenticatedLayout header={
      <div className="rounded-sm border border-green-600 bg-white shadow-md">
        <h2 className="px-4 py-4 text-2xl font-semibold">Profile Settings</h2>
      </div>
    }>
      <div className="py-12">
        <div className="mx-auto max-w-7xl space-y-8">
          <Card className="p-6 shadow-lg">
            <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail}
              status={status}
            // className="max-w-xl"
            />
          </Card>

          <Card className="p-6 shadow-lg">
            <UpdatePasswordForm />
          </Card>

          <Card className="p-6 shadow-lg">
            <DeleteUserForm />
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

