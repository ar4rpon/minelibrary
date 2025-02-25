export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
}

export type PageProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
  auth: {
    user: User;
  };
};

export type ReadStatus = 'want_read' | 'reading' | 'done_read';

export interface BookProps {
  isbn: string;
  title: string;
  author: string;
  publisher_name: string;
  item_caption: string;
  sales_date: string;
  item_price: number;
  image_url: string;
  readStatus?: ReadStatus;
  // API用
  largeImageUrl?: string;
}

export interface MemoContent {
  id: number;
  memo: string;
  memo_chapter?: number;
  memo_page?: number;
}

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  children?: React.ReactNode;
}
