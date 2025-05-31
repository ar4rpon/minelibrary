/**
 * Legacy Types for Backward Compatibility
 * 後方互換性のためのレガシー型定義
 *
 * これらの型は新しい型システムに移行済みです:
 * - User → types/domain/user.ts
 * - ReadStatus, BookProps → types/domain/book.ts
 * - MemoContent → types/domain/memo.ts
 * - DialogProps → types/ui/dialog.ts
 *
 * 新しいコードでは types/domain/, types/api/, types/ui/ から直接インポートしてください
 */

// Core page props (keep for Inertia compatibility)
export type PageProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
      email_verified_at?: string;
    };
  };
  flash?: {
    message?: string;
    error?: string;
    success?: string;
    warning?: string;
  };
  errors?: Record<string, string>;
};

// Re-export from new type system for compatibility
export type { BookProps, ReadStatus } from './domain/book';
export type { MemoContent } from './domain/memo';
export type { User } from './domain/user';
export type { DialogProps } from './ui/dialog';
