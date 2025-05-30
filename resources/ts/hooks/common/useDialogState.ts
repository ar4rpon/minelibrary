import { useState, useCallback } from 'react';

/**
 * ダイアログ制御インターフェース
 */
export interface DialogControls {
  isOpen: boolean;
  open: () => void;
  close: () => void;
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
 * 複数ダイアログの状態管理フック
 * TypeScript完全対応版
 */
export function useMultipleDialogs<T extends readonly string[]>(
  dialogNames: T
): Record<T[number], DialogControls> {
  const [states, setStates] = useState<Record<string, boolean>>(
    dialogNames.reduce((acc, name) => ({ ...acc, [name]: false }), {})
  );

  const controls = {} as Record<T[number], DialogControls>;
  
  dialogNames.forEach((name: T[number]) => {
    controls[name] = {
      isOpen: states[name] || false,
      open: useCallback(() => {
        setStates(prev => ({ ...prev, [name]: true }));
      }, [name]),
      close: useCallback(() => {
        setStates(prev => ({ ...prev, [name]: false }));
      }, [name])
    };
  });

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