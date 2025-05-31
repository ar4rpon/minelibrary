/**
 * ユーザー基本情報
 */
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * ユーザー詳細情報（プロフィール画面等で使用）
 */
export interface UserProfile extends User {
  // 統計情報
  books_count?: number;
  bookshelves_count?: number;
  memos_count?: number;
  favorite_books_count?: number;
}

/**
 * ユーザー登録データ
 */
export interface UserRegistrationData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

/**
 * ユーザー更新データ
 */
export interface UserUpdateData {
  name?: string;
  email?: string;
}

/**
 * パスワード更新データ
 */
export interface PasswordUpdateData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

/**
 * ユーザー情報（表示用）
 */
export interface UserInfo {
  userName: string;
  userImage: string;
}
