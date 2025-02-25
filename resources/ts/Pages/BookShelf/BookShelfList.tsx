import BookShelfCard from '@/Components/BookShelf/BookShelfCard';
import { Button } from '@/Components/ui/button';
import DefaultLayout from '@/Layouts/DefaultLayout';
import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { CreateBookShelfDialog } from '@/Dialog/BookShelf/CreateBookShelf';
import { useState } from 'react';

export default function BookShelfList() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const handleCreate = () => {
    setCreateDialogOpen(true);
  };
  const confirmCreate = () => {
    console.log('Create');
    setCreateDialogOpen(false);
  };
  const testData = {
    image: 'https://shop.r10s.jp/book/cabinet/0285/9784798070285_1_4.jpg',
    title: 'テストタイトル',
    description: 'これはテストの説明です。',
  };


  return (
    <DefaultLayout header="本棚一覧">
      <Head title="本棚一覧" />
      <div className="mb-4">
        <Button className='w-full' onClick={handleCreate}>
          新しい本棚を作成する
          <Plus />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-4">
        <BookShelfCard
          image={testData.image}
          title={testData.title}
          description={testData.description}
        />

      </div>


      <CreateBookShelfDialog
        isOpen={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onConfirm={confirmCreate}
      />
    </DefaultLayout>
  );
}
