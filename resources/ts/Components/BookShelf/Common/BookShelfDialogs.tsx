import { useState } from 'react';
import { EditBookShelfDialog } from '@/Dialog/BookShelf/EditBookShelfDialog';
import { DeleteBookShelfDialog } from '@/Dialog/BookShelf/DeleteBookShelfDialog';
import { AddBookDialog } from '@/Dialog/BookShelf/AddBookDialog';
import { BookShelfDialogStates } from '@/types/bookShelf';
import { updateBookShelf, deleteBookShelf, addBooksToShelf } from '@/Services/bookShelfService';

interface BookShelfDialogsProps {
  bookShelfId: number;
  initialName: string;
  initialDescription: string;
  initialIsPublic: boolean;
  dialogStates: BookShelfDialogStates;
  onDialogStateChange: (dialogKey: keyof BookShelfDialogStates, isOpen: boolean) => void;
}

export function BookShelfDialogs({
  bookShelfId,
  initialName,
  initialDescription,
  initialIsPublic,
  dialogStates,
  onDialogStateChange,
}: BookShelfDialogsProps) {
  const handleEdit = async (name: string, description: string, isPublic: boolean) => {
    const success = await updateBookShelf(bookShelfId, name, description, isPublic);
    if (success) {
      onDialogStateChange('edit', false);
    }
  };

  const handleDelete = async () => {
    const success = await deleteBookShelf(bookShelfId);
    if (success) {
      onDialogStateChange('delete', false);
    }
  };

  const handleAddBook = async (selectedIsbns: string[]) => {
    const success = await addBooksToShelf(bookShelfId, selectedIsbns);
    if (success) {
      onDialogStateChange('addBook', false);
    }
  };

  return (
    <>
      <EditBookShelfDialog
        isOpen={dialogStates.edit}
        onClose={() => onDialogStateChange('edit', false)}
        onEditBookShelfConfirm={handleEdit}
        initialName={initialName}
        initialDescription={initialDescription}
        initialIsPublic={initialIsPublic}
      />

      <DeleteBookShelfDialog
        isOpen={dialogStates.delete}
        onClose={() => onDialogStateChange('delete', false)}
        onConfirm={handleDelete}
      />

      {dialogStates.addBook !== undefined && (
        <AddBookDialog
          isOpen={dialogStates.addBook}
          onClose={() => onDialogStateChange('addBook', false)}
          AddBooksConfirm={handleAddBook}
        />
      )}
    </>
  );
}

// ダイアログ状態管理用のカスタムフック
export function useBookShelfDialogs(includeAddBook = false): [
  BookShelfDialogStates,
  (dialogKey: keyof BookShelfDialogStates, isOpen: boolean) => void
] {
  const initialState: BookShelfDialogStates = {
    edit: false,
    delete: false,
    ...(includeAddBook ? { addBook: false } : {}),
  };

  const [dialogStates, setDialogStates] = useState<BookShelfDialogStates>(initialState);

  const handleDialogState = (dialogKey: keyof BookShelfDialogStates, isOpen: boolean) => {
    setDialogStates(prev => ({ ...prev, [dialogKey]: isOpen }));
  };

  return [dialogStates, handleDialogState];
}
