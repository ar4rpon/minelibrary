import { useState } from 'react';
import { BookShelfDialogStates } from '@/types/bookShelf';

/**
 * BookShelfコンポーネントの状態を管理するカスタムフック
 * ダイアログの開閉状態などを管理
 */
export function useBookShelfState(includeAddBook = false) {
  // ダイアログの開閉状態
  const initialState: BookShelfDialogStates = {
    edit: false,
    delete: false,
    ...(includeAddBook ? { addBook: false } : {}),
  };

  const [dialogStates, setDialogStates] = useState<BookShelfDialogStates>(initialState);

  const handleDialogState = (dialogKey: keyof BookShelfDialogStates, isOpen: boolean) => {
    setDialogStates(prev => ({ ...prev, [dialogKey]: isOpen }));
  };

  return {
    dialogs: {
      edit: {
        isOpen: dialogStates.edit,
        open: () => handleDialogState('edit', true),
        close: () => handleDialogState('edit', false),
      },
      delete: {
        isOpen: dialogStates.delete,
        open: () => handleDialogState('delete', true),
        close: () => handleDialogState('delete', false),
      },
      ...(includeAddBook
        ? {
          addBook: {
            isOpen: dialogStates.addBook,
            open: () => handleDialogState('addBook', true),
            close: () => handleDialogState('addBook', false),
          },
        }
        : {}),
    },
  };
}
