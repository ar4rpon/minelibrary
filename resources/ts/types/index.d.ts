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

export interface BookProps {
  title: string;
  author: string;
  publisherName: string;
  salesDate: string;
  itemPrice: number;
  largeImageUrl: string;
  isbn: string;
  itemCaption: string;
}

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  children?: React.ReactNode;
}
