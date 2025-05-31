// BookShelf関連の共通型定義

// 本棚の基本情報
export interface BookShelfBase {
  bookShelfId: number;
  name: string;
  description: string;
  isPublic: boolean;
}

// ダイアログの状態管理用
export interface BookShelfDialogStates {
  edit: boolean;
  delete: boolean;
  addBook?: boolean; // 本の追加ダイアログは一部のコンポーネントでのみ使用
  shareLink?: boolean;
}

// ユーザー情報
export interface UserInfo {
  userName: string;
  userImage: string;
}

// 本棚カード用のプロパティ
export interface BookShelfCardProps extends BookShelfBase {
  image?: string;
}

// 本棚詳細用のプロパティ
export interface BookShelfDescriptionProps
  extends BookShelfBase,
    Partial<UserInfo> {}

// ドロップダウンメニューのアクション用
export interface BookShelfActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

// 拡張アクション（本の追加などを含む）
export interface ExtendedBookShelfActionsProps extends BookShelfActionsProps {
  onAddBook: () => void;
  onShare?: () => void;
}

// 本の基本情報
export interface Book {
  isbn: string;
  title: string;
  author: string;
  sales_date: string;
  read_status: string;
}

// APIレスポンス型
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}
