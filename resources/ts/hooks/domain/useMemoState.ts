import {
  createDialogNames,
  useMultipleDialogs,
} from '@/hooks/common/useDialogState';
import { MemoContent } from '@/types';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';

/**
 * Memo関連のダイアログ名定義
 */
const MEMO_DIALOG_NAMES = createDialogNames('create', 'edit', 'delete');

/**
 * メモの状態と操作を管理するカスタムフック
 * 統一されたダイアログ状態管理を使用
 */
export function useMemoState(isbn: string) {
  const [selectedMemo, setSelectedMemo] = useState<MemoContent | null>(null);

  // 統一されたダイアログ管理フックを使用
  const dialogs = useMultipleDialogs(MEMO_DIALOG_NAMES);

  // メモの編集ダイアログを開く
  const openEditDialog = (content: MemoContent) => {
    setSelectedMemo(content);
    dialogs.edit.open();
  };

  // メモの削除ダイアログを開く
  const openDeleteDialog = (content: MemoContent) => {
    setSelectedMemo(content);
    dialogs.delete.open();
  };

  // メモの作成ダイアログを開く
  const openCreateDialog = () => {
    dialogs.create.open();
  };

  // メモを編集する
  const editMemo = async (
    updatedMemo: string,
    chapter?: number,
    page?: number,
  ) => {
    if (!selectedMemo) return;
    try {
      await axios.put(`/memo/${selectedMemo.id}`, {
        memo: updatedMemo,
        memo_chapter: chapter,
        memo_page: page,
      });
      router.reload();
    } catch (error) {
      console.error('Failed to edit memo:', error);
    }
    dialogs.edit.close();
  };

  // メモを削除する
  const deleteMemo = async () => {
    if (!selectedMemo) return;
    try {
      await axios.delete(`/memo/${selectedMemo.id}`);
      router.reload();
    } catch (error) {
      console.error('Failed to delete memo:', error);
    }
    dialogs.delete.close();
  };

  // メモを作成する
  const createMemo = async (memo: string, chapter?: number, page?: number) => {
    try {
      await axios.post('/memo/create', {
        isbn,
        memo,
        memo_chapter: chapter,
        memo_page: page,
      });
      router.reload();
    } catch (error) {
      console.error('Failed to create memo:', error);
    }
    dialogs.create.close();
  };

  return {
    dialogs: {
      delete: {
        isOpen: dialogs.delete.isOpen,
        open: openDeleteDialog,
        close: dialogs.delete.close,
      },
      edit: {
        isOpen: dialogs.edit.isOpen,
        open: openEditDialog,
        close: dialogs.edit.close,
      },
      create: {
        isOpen: dialogs.create.isOpen,
        open: openCreateDialog,
        close: dialogs.create.close,
      },
    },
    selectedMemo,
    actions: {
      editMemo,
      deleteMemo,
      createMemo,
    },
  };
}
