import { apiClient } from '@/api/client';
import { useAsyncState } from '@/api/hooks';
import { useMultipleDialogs } from '@/hooks/common';
import { ApiErrorHandler } from '@/lib/errors';
import type { MemoContent } from '@/types/domain/memo';
import { router } from '@inertiajs/react';
import { useState } from 'react';

/**
 * メモ操作のダイアログ
 */
const MEMO_DIALOGS = ['delete', 'edit', 'create'] as const;

/**
 * メモに関する操作と状態を管理するフック
 */
export function useMemo(isbn: string) {
  // ダイアログ状態管理
  const dialogs = useMultipleDialogs(MEMO_DIALOGS);

  // 選択されたメモの状態管理
  const [selectedMemo, setSelectedMemo] = useState<MemoContent | null>(null);

  // 非同期処理状態管理
  const createState = useAsyncState<boolean>();
  const editState = useAsyncState<boolean>();
  const deleteState = useAsyncState<boolean>();

  /**
   * 編集ダイアログを開く
   */
  const openEditDialog = (content: MemoContent) => {
    setSelectedMemo(content);
    dialogs.edit.open();
  };

  /**
   * 削除ダイアログを開く
   */
  const openDeleteDialog = (content: MemoContent) => {
    setSelectedMemo(content);
    dialogs.delete.open();
  };

  /**
   * 作成ダイアログを開く
   */
  const openCreateDialog = () => {
    dialogs.create.open();
  };

  /**
   * メモを作成
   */
  const createMemo = async (memo: string, chapter?: number, page?: number) => {
    const result = await createState.execute(async () => {
      await ApiErrorHandler.executeWithErrorHandling(
        () =>
          apiClient.post('/memo/create', {
            isbn,
            memo,
            memo_chapter: chapter,
            memo_page: page,
          }),
        'useMemo.createMemo',
      );
      router.reload();
      return true;
    });

    if (result) {
      dialogs.create.close();
    }
    return result;
  };

  /**
   * メモを編集
   */
  const editMemo = async (
    updatedMemo: string,
    chapter?: number,
    page?: number,
  ) => {
    if (!selectedMemo) return false;

    const result = await editState.execute(async () => {
      await ApiErrorHandler.executeWithErrorHandling(
        () =>
          apiClient.put(`/memo/${selectedMemo.id}`, {
            memo: updatedMemo,
            memo_chapter: chapter,
            memo_page: page,
          }),
        'useMemo.editMemo',
      );
      router.reload();
      return true;
    });

    if (result) {
      dialogs.edit.close();
    }
    return result;
  };

  /**
   * メモを削除
   */
  const deleteMemo = async () => {
    if (!selectedMemo) return false;

    const result = await deleteState.execute(async () => {
      await ApiErrorHandler.executeWithErrorHandling(
        () => apiClient.delete(`/memo/${selectedMemo.id}`),
        'useMemo.deleteMemo',
      );
      router.reload();
      return true;
    });

    if (result) {
      dialogs.delete.close();
    }
    return result;
  };

  return {
    // ダイアログ状態
    dialogs: {
      delete: {
        ...dialogs.delete,
        open: openDeleteDialog,
      },
      edit: {
        ...dialogs.edit,
        open: openEditDialog,
      },
      create: {
        ...dialogs.create,
        open: openCreateDialog,
      },
    },

    // 選択されたメモ
    selectedMemo,
    setSelectedMemo,

    // 非同期操作
    actions: {
      createMemo,
      editMemo,
      deleteMemo,
      openEditDialog,
      openDeleteDialog,
      openCreateDialog,
    },

    // ローディング・エラー状態
    states: {
      create: createState,
      edit: editState,
      delete: deleteState,
    },

    // 便利なフラグ
    isLoading: [createState, editState, deleteState].some(
      (state) => state.loading,
    ),
    hasError: [createState, editState, deleteState].some(
      (state) => state.hasError,
    ),

    // 後方互換性（段階的に削除予定）
    deleteDialogOpen: dialogs.delete.isOpen,
    editDialogOpen: dialogs.edit.isOpen,
    createDialogOpen: dialogs.create.isOpen,
  };
}

/**
 * 後方互換性のためのエイリアス（段階的に削除予定）
 */
export const useMemoState = useMemo;
