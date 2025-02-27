import React from 'react';
import { Separator } from '@/Components/ui/separator';
import { BookShelfBase, UserInfo as UserInfoType } from '@/types/bookShelf';
import { BaseBookShelfCard } from './BaseBookShelfCard';
import { BookShelfHeader } from './BookShelfHeader';
import { useBookShelfState } from './hooks/useBookShelfState';
import { BookShelfDialogs } from './BookShelfDialogs';

// デフォルト値
const DEFAULT_USER_NAME = 'ユーザー名';
const DEFAULT_USER_IMAGE = 'https://placehold.jp/150x150.png';

// ユーザー情報コンポーネント
function UserInfo({
  userName = DEFAULT_USER_NAME,
  userImage = DEFAULT_USER_IMAGE,
}: Partial<UserInfoType>) {
  return (
    <div className="flex items-center">
      <img
        className="w-9 h-9 rounded-3xl"
        src={userImage}
        alt={`${userName}のプロフィール画像`}
      />
      <p className="ml-2 md:ml-4 text-md font-semibold text-gray-600">{userName}</p>
    </div>
  );
}

interface BookShelfDescriptionCardProps extends BookShelfBase {
  userName?: string;
  userImage?: string;
}

/**
 * 詳細バリアントの本棚カードコンポーネント
 */
export function BookShelfDescriptionCard({
  bookShelfId,
  name,
  description,
  isPublic,
  userName,
  userImage,
}: BookShelfDescriptionCardProps) {
  const { dialogs } = useBookShelfState(true);

  return (
    <BaseBookShelfCard variant="description" bookShelfId={bookShelfId} name={name} description={description} isPublic={isPublic}>
      <BookShelfHeader
        name={name}
        description={description}
        variant="description"
        onEdit={dialogs.edit.open}
        onDelete={dialogs.delete.open}
        onAddBook={dialogs.addBook?.open}
      />

      <Separator className="my-4" />

      <UserInfo userName={userName} userImage={userImage} />

      <BookShelfDialogs
        bookShelfId={bookShelfId}
        initialName={name}
        initialDescription={description}
        initialIsPublic={isPublic}
        dialogStates={{
          edit: dialogs.edit.isOpen,
          delete: dialogs.delete.isOpen,
          addBook: dialogs.addBook?.isOpen,
        }}
        onDialogStateChange={(dialogKey, isOpen) => {
          if (dialogKey === 'edit') {
            isOpen ? dialogs.edit.open() : dialogs.edit.close();
          } else if (dialogKey === 'delete') {
            isOpen ? dialogs.delete.open() : dialogs.delete.close();
          } else if (dialogKey === 'addBook' && dialogs.addBook) {
            isOpen ? dialogs.addBook.open() : dialogs.addBook.close();
          }
        }}
      />
    </BaseBookShelfCard>
  );
}
