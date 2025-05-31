/**
 * Dialog UI Types
 * ダイアログコンポーネント関連型定義
 */

import { ReactNode } from 'react';

/**
 * ダイアログ基本プロパティ
 */
export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  children?: ReactNode;
  onConfirm?: () => void | Promise<void>;
}

/**
 * 確認ダイアログプロパティ
 */
export interface ConfirmDialogProps extends DialogProps {
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive' | 'warning';
}

/**
 * フォームダイアログプロパティ
 */
export interface FormDialogProps extends DialogProps {
  onSubmit: (data: unknown) => void;
  isLoading?: boolean;
  submitText?: string;
  resetOnClose?: boolean;
  validation?: Record<string, unknown>;
}

/**
 * BookShelf ダイアログ状態
 */
export interface BookShelfDialogStates {
  edit: boolean;
  delete: boolean;
  addBook?: boolean;
  shareLink?: boolean;
}

/**
 * ダイアログのアニメーション設定
 */
export interface DialogAnimation {
  enter: string;
  enterFrom: string;
  enterTo: string;
  leave: string;
  leaveFrom: string;
  leaveTo: string;
}

/**
 * ダイアログコンテキスト
 */
export interface DialogContext {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  data?: unknown;
  setData: (data: unknown) => void;
}

/**
 * モーダルダイアログの設定オプション
 */
export interface ModalOptions {
  backdrop?: boolean | 'static';
  keyboard?: boolean;
  focus?: boolean;
  show?: boolean;
  zIndex?: number;
}
