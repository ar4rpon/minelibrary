import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { BaseDialog } from '@/Dialog/BaseDialog';
import { BookDetailDialog } from '@/Dialog/BookDetailDialog';
import { CreateMemoDialog } from '@/Dialog/Memo/CreateMemoDialog';
import { EditMemoDialog } from '@/Dialog/Memo/EditMemoDialog';
import { DeleteMemoDialog } from '@/Dialog/Memo/DeleteMemoDialog';
import { useState } from 'react';
import { Button } from '@/Components/ui/button';

export default function BookShelfList() {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  let id: string = "1";
  const handleEdit = () => {
    setEditDialogOpen(true);
  };

  const confirmEdit = () => {
    console.log('Edit note:', id);
    setDeleteDialogOpen(false);
  };

  const handleCreate = () => {
    setCreateDialogOpen(true);
  };

  const confirmCreate = () => {
    console.log('Create note:', id);
    setCreateDialogOpen(false);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    console.log('Delete note:', id);
    setDeleteDialogOpen(false);
  };
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
            <BookDetailDialog title="本のタイトル" author='著者名' publisher='出版社' publishDate='2024年2月1日' price={1500} imageUrl='https://shop.r10s.jp/book/cabinet/9163/9784297129163_1_4.jpg' />
          </div>
          <div className="flex flex-col mt-4">
            <h2>CreateMemoDialog</h2>
            <Button onClick={handleCreate}>メモ作成</Button>
            <CreateMemoDialog
              isOpen={createDialogOpen}
              onClose={() => setCreateDialogOpen(false)}
              onConfirm={confirmCreate}
            />
          </div>
          <div className="flex flex-col mt-4">
            <h2>EditMemoDialog</h2>
            <Button onClick={handleEdit}>編集</Button>
            <EditMemoDialog
              isOpen={editDialogOpen}
              onClose={() => setEditDialogOpen(false)}
              onConfirm={confirmEdit}
            />
          </div>
          <div className="flex flex-col mt-4">
            <h2>DeleteMemoDialog</h2>
            <Button onClick={handleDelete}>削除</Button>
            <DeleteMemoDialog
              isOpen={deleteDialogOpen}
              onClose={() => setDeleteDialogOpen(false)}
              onConfirm={confirmDelete} />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
