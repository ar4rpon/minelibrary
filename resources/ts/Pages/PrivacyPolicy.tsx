import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function PrivacyPolicy() {
  return (
    <AuthenticatedLayout header="プライバシーポリシー">
      <Head title="プライバシーポリシー" />
      main content
    </AuthenticatedLayout>
  );
}
