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

export type BookStatus = 'want_read' | 'reading' | 'done_read';

export interface BookProps {
  isbn: string;
  title: string;
  author: string;
  publisherName: string;
  itemCaption: string;
  salesDate: string;
  itemPrice: number;
  imageUrl: string;
  readStatus?: BookStatus;
  // API用
  largeImageUrl?: string;
}

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  children?: React.ReactNode;
}
