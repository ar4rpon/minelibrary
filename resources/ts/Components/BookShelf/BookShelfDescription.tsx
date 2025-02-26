import { Separator } from '@/Components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { BookPlus, MoreVertical, Pencil, Share, Trash } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { EditBookShelfDialog } from '@/Dialog/BookShelf/EditBookShelfDialog';
import { DeleteBookShelfDialog } from '@/Dialog/BookShelf/DeleteBookShelfDialog';
import { useState } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';
import { AddBookDialog } from '@/Dialog/BookShelf/AddBookDialog';

export default function BookShelfDescription({ name, description, isPublic, bookShelfId }: any) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addBookDialogOpen, setAddBookDialogOpen] = useState(false);

  const handleEdit = () => {
    setEditDialogOpen(true);
  };

  const confirmEdit = async (name: string, description: string, isPublic: boolean) => {
    try {
      console.log(name)
      console.log(description)
      console.log(isPublic)
      await axios.put(`/book-shelf/update/${bookShelfId}`, {
        book_shelf_name: name,
        description: description,
        is_public: isPublic
      });
      router.reload();
    } catch (error) {
      console.error('Failed to update bookshelf:', error);
    }
    setEditDialogOpen(false);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/book-shelf/delete/${bookShelfId}`);
      router.visit('/');
    } catch (error) {
      console.error('Failed to delete bookshelf:', error);
    }
    setDeleteDialogOpen(false);
  };

  const handleShare = () => {
    console.log('Share bookshelf');
  };

  const handleAddBook = async (selectedIsbns: string[]) => {
    try {
      await axios.post('/book-shelf/add/books', {
        book_shelf_id: bookShelfId,
        isbns: selectedIsbns
      });
      setAddBookDialogOpen(false)
      router.reload();
    } catch (error) {
      console.error('本の追加に失敗しました:', error);
    }
  };

  return (
    <div className="rounded-sm border border-green-600 bg-white shadow-md min-h-40 mt-4 px-4 py-2 md:py-4">
      <div className="flex items-center justify-between">
        <p className="font-bold text-2xl">{name}</p>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem onClick={() => setAddBookDialogOpen(true)}>
              <BookPlus className="mr-2 h-4 w-4" />
              本を追加する
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              本棚を編集する
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShare}>
              <Share className="mr-2 h-4 w-4" />
              本棚を共有する
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>
              <Trash className="mr-2 h-4 w-4" />
              本棚を削除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p className="text-md mt-1 text-gray-700">{description}</p>
      <Separator className="my-4" />

      <div className="flex items-center">
        <img className='w-9 h-9 rounded-3xl' src="https://placehold.jp/150x150.png" alt="" />
        <p className="ml-2 md:ml-4 text-md font-semibold text-gray-600">ユーザー名</p>
      </div>

      <EditBookShelfDialog
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onEditBookShelfConfirm={confirmEdit}
        initialName={name}
        initialDescription={description}
        initialIsPublic={isPublic}
      />

      <DeleteBookShelfDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
      />
      <AddBookDialog
        isOpen={addBookDialogOpen}
        onClose={() => setAddBookDialogOpen(false)}
        AddBooksConfirm={handleAddBook}
      />
    </div>
  );
}
