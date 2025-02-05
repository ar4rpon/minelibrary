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

interface BookProps {
  title: string;
  author: string;
  publisher: string;
  publishDate: string;
  price: number;
  imageUrl: string;
  isbn?: string;
}
