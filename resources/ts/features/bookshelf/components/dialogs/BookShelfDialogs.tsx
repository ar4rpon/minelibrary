import {
  addBooksToShelf,
  deleteBookShelf,
  updateBookShelf,
} from '@/Services/bookShelfService';
import { BookShelfDialogStates } from '@/types/bookShelf';
import { AddBookDialog } from './AddBookDialog';
import { DeleteBookShelfDialog } from './DeleteBookShelfDialog';
import { EditBookShelfDialog } from './EditBookShelfDialog';
import { ShareLinkDialog } from './ShareLinkDialog';

interface BookShelfDialogsProps {
  bookShelfId: number;
  initialName: string;
  initialDescription: string;
  initialIsPublic: boolean;
  dialogStates: BookShelfDialogStates;
  onDialogStateChange: (
    dialogKey: keyof BookShelfDialogStates,
    isOpen: boolean,
  ) => void;
}

/**
 * 本棚関連のダイアログをまとめて管理するコンポーネント
 */
export function BookShelfDialogs({
  bookShelfId,
  initialName,
  initialDescription,
  initialIsPublic,
  dialogStates,
  onDialogStateChange,
}: BookShelfDialogsProps) {
  const handleEdit = async (
    name: string,
    description: string,
    isPublic: boolean,
  ) => {
    const success = await updateBookShelf(
      bookShelfId,
      name,
      description,
      isPublic,
    );
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

      {dialogStates.shareLink !== undefined && (
        <ShareLinkDialog
          isOpen={dialogStates.shareLink}
          onClose={() => onDialogStateChange('shareLink', false)}
          bookShelfId={bookShelfId}
        />
      )}

    </>
  );
}
