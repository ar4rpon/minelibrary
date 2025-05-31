import { useCallback, useMemo, useState } from 'react';

/**
 * ダイアログ制御インターフェース
 */
export interface DialogControls {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  isLoading?: boolean;
  setLoading?: (loading: boolean) => void;
}

/**
 * 拡張ダイアログ制御インターフェース（ローディング状態付き）
 */
export interface ExtendedDialogControls extends DialogControls {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

/**
 * 単一ダイアログの状態管理フック
 */
export function useDialogState(initialState = false): DialogControls {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, open, close };
}

/**
 * ローディング状態付きダイアログの状態管理フック
 */
export function useDialogStateWithLoading(
  initialState = false,
): ExtendedDialogControls {
  const [isOpen, setIsOpen] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    setIsLoading(false); // ダイアログを閉じる際にローディング状態もリセット
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  return { isOpen, open, close, isLoading, setLoading };
}

/**
 * 複数ダイアログの状態管理フック
 * TypeScript完全対応版
 */
export function useMultipleDialogs<T extends readonly string[]>(
  dialogNames: T,
): Record<T[number], DialogControls> {
  const [states, setStates] = useState<Record<string, boolean>>(
    dialogNames.reduce((acc, name) => ({ ...acc, [name]: false }), {}),
  );

  const openDialog = useCallback((name: string) => {
    setStates((prev) => ({ ...prev, [name]: true }));
  }, []);

  const closeDialog = useCallback((name: string) => {
    setStates((prev) => ({ ...prev, [name]: false }));
  }, []);

  const controls = useMemo(() => {
    const result = {} as Record<T[number], DialogControls>;

    dialogNames.forEach((name: T[number]) => {
      result[name] = {
        isOpen: states[name] || false,
        open: () => openDialog(name),
        close: () => closeDialog(name),
      };
    });

    return result;
  }, [states, openDialog, closeDialog, dialogNames]);

  return controls;
}

/**
 * ローディング状態付き複数ダイアログの状態管理フック
 */
export function useMultipleDialogsWithLoading<T extends readonly string[]>(
  dialogNames: T,
): Record<T[number], ExtendedDialogControls> {
  const [dialogStates, setDialogStates] = useState<Record<string, boolean>>(
    dialogNames.reduce((acc, name) => ({ ...acc, [name]: false }), {}),
  );
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    dialogNames.reduce((acc, name) => ({ ...acc, [name]: false }), {}),
  );

  const openDialog = useCallback((name: string) => {
    setDialogStates((prev) => ({ ...prev, [name]: true }));
  }, []);

  const closeDialog = useCallback((name: string) => {
    setDialogStates((prev) => ({ ...prev, [name]: false }));
    setLoadingStates((prev) => ({ ...prev, [name]: false })); // ローディング状態もリセット
  }, []);

  const setLoading = useCallback((name: string, loading: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [name]: loading }));
  }, []);

  const controls = useMemo(() => {
    const result = {} as Record<T[number], ExtendedDialogControls>;

    dialogNames.forEach((name: T[number]) => {
      result[name] = {
        isOpen: dialogStates[name] || false,
        open: () => openDialog(name),
        close: () => closeDialog(name),
        isLoading: loadingStates[name] || false,
        setLoading: (loading: boolean) => setLoading(name, loading),
      };
    });

    return result;
  }, [
    dialogStates,
    loadingStates,
    openDialog,
    closeDialog,
    setLoading,
    dialogNames,
  ]);

  return controls;
}

/**
 * ダイアログ名の型安全な配列作成ヘルパー
 */
export function createDialogNames<T extends readonly string[]>(...names: T): T {
  return names;
}

// 使用例（コメント）:
// const DIALOG_NAMES = createDialogNames('edit', 'delete', 'share') as const;
// const dialogs = useMultipleDialogs(DIALOG_NAMES);
// dialogs.edit.open(); // 型安全

// ローディング状態付き使用例:
// const dialogsWithLoading = useMultipleDialogsWithLoading(DIALOG_NAMES);
// dialogsWithLoading.edit.setLoading(true);
// await someAsyncOperation();
// dialogsWithLoading.edit.setLoading(false);
