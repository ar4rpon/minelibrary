/**
 * UI Component Types
 * 汎用UIコンポーネント型定義
 */

import { ReactNode } from 'react';

/**
 * 基本コンポーネントプロパティ
 */
export interface BaseComponentProps {
  children?: ReactNode;
  className?: string;
  id?: string;
  testId?: string;
}

/**
 * サイズバリアント
 */
export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * カラーバリアント
 */
export type ColorVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

/**
 * ボタンバリアント
 */
export type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link';

/**
 * カードバリアント
 */
export type CardVariant =
  | 'book-default'
  | 'book-favorite'
  | 'book-shelf'
  | 'bookshelf-card'
  | 'bookshelf-description'
  | 'memo-card';

/**
 * 基本カードプロパティ
 */
export interface BaseCardProps extends BaseComponentProps {
  variant?: CardVariant;
  padding?: SizeVariant;
  shadow?: boolean;
  border?: boolean;
  rounded?: boolean;
}

/**
 * バッジプロパティ
 */
export interface BadgeProps extends BaseComponentProps {
  variant?: ColorVariant;
  size?: SizeVariant;
  outline?: boolean;
  dot?: boolean;
}

/**
 * ローディング状態
 */
export interface LoadingState {
  isLoading: boolean;
  loadingText?: string;
  spinner?: boolean;
}

/**
 * フォーム要素の状態
 */
export interface FormElementState {
  value: unknown;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
  required?: boolean;
}

/**
 * ページネーション設定
 */
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
  showFirst?: boolean;
  showLast?: boolean;
}

/**
 * レスポンシブブレークポイント
 */
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * アニメーション設定
 */
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: string;
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
}

/**
 * 本棚アクション用プロパティ
 */
export interface BookShelfActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * 拡張本棚アクション（本の追加などを含む）
 */
export interface ExtendedBookShelfActionsProps extends BookShelfActionsProps {
  onAddBook: () => void;
  onShare?: () => void;
}
