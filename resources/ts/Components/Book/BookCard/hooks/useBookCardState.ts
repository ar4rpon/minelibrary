import { useState } from 'react';
import { ReadStatus } from '@/types';

/**
 * BookCardコンポーネントの状態を管理するカスタムフック
 * ダイアログの開閉状態や読書状態などを管理
 */
export function useBookCardState(initialReadStatus?: ReadStatus) {
  // ダイアログの開閉状態
  const [detailBookDialogOpen, setDetailBookDialogOpen] = useState(false);
  const [readStatusDialogOpen, setReadStatusDialogOpen] = useState(false);
  const [createBookShelfDialogOpen, setCreateBookShelfDialogOpen] = useState(false);
  const [deleteBookDialogOpen, setDeleteBookDialogOpen] = useState(false);
  const [createMemoDialogOpen, setCreateMemoDialogOpen] = useState(false);

  // 読書状態
  const [selectedStatus, setSelectedStatus] = useState<ReadStatus>(
    initialReadStatus ?? 'want_read',
  );

  return {
    dialogs: {
      detailBook: {
        isOpen: detailBookDialogOpen,
        open: () => setDetailBookDialogOpen(true),
        close: () => setDetailBookDialogOpen(false),
      },
      readStatus: {
        isOpen: readStatusDialogOpen,
        open: () => setReadStatusDialogOpen(true),
        close: () => setReadStatusDialogOpen(false),
      },
      createBookShelf: {
        isOpen: createBookShelfDialogOpen,
        open: () => setCreateBookShelfDialogOpen(true),
        close: () => setCreateBookShelfDialogOpen(false),
      },
      deleteBook: {
        isOpen: deleteBookDialogOpen,
        open: () => setDeleteBookDialogOpen(true),
        close: () => setDeleteBookDialogOpen(false),
      },
      createMemo: {
        isOpen: createMemoDialogOpen,
        open: () => setCreateMemoDialogOpen(true),
        close: () => setCreateMemoDialogOpen(false),
      },
    },
    readStatus: {
      status: selectedStatus,
      setStatus: setSelectedStatus,
    },
  };
}
