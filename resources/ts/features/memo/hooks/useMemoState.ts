import { MemoContent } from '@/types';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';

/**
 * メモの状態と操作を管理するカスタムフック
 */
export function useMemoState(isbn: string) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedMemo, setSelectedMemo] = useState<MemoContent | null>(null);

  // メモの編集ダイアログを開く
  const openEditDialog = (content: MemoContent) => {
    setSelectedMemo(content);
    setEditDialogOpen(true);
  };

  // メモの削除ダイアログを開く
  const openDeleteDialog = (content: MemoContent) => {
    setSelectedMemo(content);
    setDeleteDialogOpen(true);
  };

  // メモの作成ダイアログを開く
  const openCreateDialog = () => {
    setCreateDialogOpen(true);
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
    setEditDialogOpen(false);
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
    setDeleteDialogOpen(false);
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
    setCreateDialogOpen(false);
  };

  return {
    dialogs: {
      delete: {
        isOpen: deleteDialogOpen,
        open: openDeleteDialog,
        close: () => setDeleteDialogOpen(false),
      },
      edit: {
        isOpen: editDialogOpen,
        open: openEditDialog,
        close: () => setEditDialogOpen(false),
      },
      create: {
        isOpen: createDialogOpen,
        open: openCreateDialog,
        close: () => setCreateDialogOpen(false),
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
