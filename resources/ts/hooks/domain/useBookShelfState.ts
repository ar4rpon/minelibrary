import {
  createDialogNames,
  useMultipleDialogs,
} from '@/hooks/common/useDialogState';

/**
 * BookShelf関連のダイアログ名定義
 */
const BOOKSHELF_DIALOG_NAMES = createDialogNames('edit', 'delete', 'shareLink');
const BOOKSHELF_WITH_ADD_DIALOG_NAMES = createDialogNames(
  'edit',
  'delete',
  'shareLink',
  'addBook',
);

/**
 * BookShelfコンポーネントの状態を管理するカスタムフック
 * 統一されたダイアログ状態管理を使用
 */
export function useBookShelfState(includeAddBook = false) {
  // 統一されたダイアログ管理フックを使用
  const dialogControls = useMultipleDialogs(
    includeAddBook ? BOOKSHELF_WITH_ADD_DIALOG_NAMES : BOOKSHELF_DIALOG_NAMES,
  );

  return {
    dialogs: dialogControls,
  };
}
