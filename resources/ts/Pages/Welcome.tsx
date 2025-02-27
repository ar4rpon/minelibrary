import DefaultLayout from '@/components/layout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';

export default function Welcome({}: PageProps<{
  laravelVersion: string;
  phpVersion: string;
}>) {
  const handleImageError = () => {
    document.getElementById('screenshot-container')?.classList.add('!hidden');
    document.getElementById('docs-card')?.classList.add('!row-span-1');
    document.getElementById('docs-card-content')?.classList.add('!flex-row');
    document.getElementById('background')?.classList.add('!hidden');
  };

  return (
    <DefaultLayout header="TOP PAGE">
      <Head title="TOP PAGE" />

      <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
        <div className="p-6 text-gray-900">TOP PAGE</div>
      </div>
    </DefaultLayout>
  );
}
