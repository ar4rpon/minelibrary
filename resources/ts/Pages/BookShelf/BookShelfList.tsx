import BookShelfCard from '@/Components/BookShelf/BookShelfCard';
import DefaultLayout from '@/Layouts/DefaultLayout';
import { Head } from '@inertiajs/react';

export default function BookShelfList() {
  const testData = {
    image: 'https://shop.r10s.jp/book/cabinet/0285/9784798070285_1_4.jpg',
    title: 'テストタイトル',
    description: 'これはテストの説明です。',
  };

  return (
    <DefaultLayout header="本棚一覧">
      <Head title="本棚一覧" />
      <BookShelfCard
        image={testData.image}
        title={testData.title}
        description={testData.description}
      />
    </DefaultLayout>
  );
}
