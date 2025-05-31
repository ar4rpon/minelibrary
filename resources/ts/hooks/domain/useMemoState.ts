// 1. React and external libraries
import { useState } from 'react';
import { router } from '@inertiajs/react';

// 2. Internal API/services
import { useAsyncState } from '@/api/hooks';
import { MemoService } from '@/api/services';

// 3. Hooks
import {
  createDialogNames,
  useMultipleDialogs,
} from '@/hooks/common/useDialogState';

// 4. Types
import type { MemoContent } from '@/types/domain/memo';

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

  // 統一されたエラーハンドリング
  const editMemoState = useAsyncState<void>();
  const deleteMemoState = useAsyncState<void>();
  const createMemoState = useAsyncState<void>();

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

    await editMemoState.execute(() =>
      MemoService.updateMemo(selectedMemo.id, {
        memo: updatedMemo,
        memo_chapter: chapter,
        memo_page: page,
      }),
    );

    if (!editMemoState.hasError) {
      router.reload();
      dialogs.edit.close();
    }
  };

  // メモを削除する
  const deleteMemo = async () => {
    if (!selectedMemo) return;

    await deleteMemoState.execute(() =>
      MemoService.deleteMemo(selectedMemo.id),
    );

    if (!deleteMemoState.hasError) {
      router.reload();
      dialogs.delete.close();
    }
  };

  // メモを作成する
  const createMemo = async (memo: string, chapter?: number, page?: number) => {
    await createMemoState.execute(() =>
      MemoService.createMemo({
        isbn,
        memo,
        memo_chapter: chapter,
        memo_page: page,
      }),
    );

    if (!createMemoState.hasError) {
      router.reload();
      dialogs.create.close();
    }
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
    // 統一されたローディングとエラー状態
    isLoading:
      editMemoState.loading ||
      deleteMemoState.loading ||
      createMemoState.loading,
    hasError:
      editMemoState.hasError ||
      deleteMemoState.hasError ||
      createMemoState.hasError,
  };
}
