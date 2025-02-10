import { Separator } from '@/Components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { MoreVertical, Pencil, Trash } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { EditBookShelfDialog } from '@/Dialog/BookShelf/EditBookShelfDialog';
import { DeleteBookShelfDialog } from '@/Dialog/BookShelf/DeleteBookShelfDialog';
import { useState } from 'react';

export default function BookShelfDescription() {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleEdit = () => {
    setEditDialogOpen(true);
  };

  const confirmEdit = () => {
    console.log('Edit');
    setDeleteDialogOpen(false);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    console.log('Delete');
    setDeleteDialogOpen(false);
  };

  return (
    <div className="rounded-sm border border-green-600 bg-white shadow-md min-h-40 mt-4 px-4 py-2  md:py-4">
      <div className="flex items-center justify-between">
        <p className="font-bold text-2xl">本棚名</p>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem onClick={handleEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              編集
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>
              <Trash className="mr-2 h-4 w-4" />
              削除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
      <p className="text-md mt-1 text-gray-700">本棚説明本棚説明本棚説明本棚説明本棚説明本棚説明本棚説明本棚説明本棚説明本棚説明本棚説明</p>
      <Separator className="my-4" />

      <div className="flex items-center">
        <img className='w-9 h-9 rounded-3xl' src="https://placehold.jp/150x150.png" alt="" />
        <p className="ml-2 md:ml-4 text-md font-semibold text-gray-600">ユーザー名</p>
      </div>

      {/* ダイアログ */}
      <EditBookShelfDialog
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onConfirm={confirmEdit}
      />

      <DeleteBookShelfDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete} />
    </div>
  );
}
