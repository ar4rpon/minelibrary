import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function PrivacyPolicy() {
  return (
    <AuthenticatedLayout header="プライバシーポリシー">
      <Head title="プライバシーポリシー" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl">main content</div>
      </div>
    </AuthenticatedLayout>
  );
}
