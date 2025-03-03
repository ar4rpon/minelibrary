import { Separator } from '@/components/common/ui/separator';
import { BookShelfDialogs } from '@/features/bookshelf/components/dialogs/BookShelfDialogs';
import { ShareLinkDialog } from '@/features/bookshelf/components/dialogs/ShareLinkDialog';
import { useBookShelfState } from '@/features/bookshelf/hooks/useBookShelfState';
import { BookShelfBase } from '@/types/bookShelf';
import { useState } from 'react';
import { Header } from '../elements/Header';
import { UserInfo } from '../elements/UserInfo';
import { BaseCard } from './BaseCard';

interface DetailCardProps extends BookShelfBase {
  userName?: string;
  userImage?: string;
  isShared?: boolean;
}

/**
 * 詳細バリアントの本棚カードコンポーネント
 */
export function DetailCard({
  bookShelfId,
  name,
  description,
  isPublic,
  userName,
  isShared,
}: DetailCardProps) {
  const { dialogs } = useBookShelfState(true);

  return (
    <BaseCard
      variant="description"
      bookShelfId={bookShelfId}
      name={name}
      description={description}
      isPublic={isPublic}
    >
      {!isShared ? (
        <Header
          name={name}
          description={description}
          variant="description"
          onEdit={dialogs.edit.open}
          onDelete={dialogs.delete.open}
          onAddBook={dialogs.addBook?.open}
          onShare={dialogs.shareLink.open}
        />
      ) : (
        <Header
          name={name}
          description={description}
          variant="description"
          onEdit={() => { }}
          onDelete={() => { }}
          isShared={true}
        />
      )}

      <Separator className="my-4" />

      <UserInfo userName={userName} />

      {!isShared && (
        <>
          <BookShelfDialogs
            bookShelfId={bookShelfId}
            initialName={name}
            initialDescription={description}
            initialIsPublic={isPublic}
            dialogStates={{
              edit: dialogs.edit.isOpen,
              delete: dialogs.delete.isOpen,
              addBook: dialogs.addBook?.isOpen,
              shareLink: dialogs.shareLink?.isOpen,
            }}
            onDialogStateChange={(dialogKey, isOpen) => {
              if (dialogKey === 'edit') {
                isOpen ? dialogs.edit.open() : dialogs.edit.close();
              } else if (dialogKey === 'delete') {
                isOpen ? dialogs.delete.open() : dialogs.delete.close();
              } else if (dialogKey === 'addBook' && dialogs.addBook) {
                isOpen ? dialogs.addBook.open() : dialogs.addBook.close();
              } else if (dialogKey === 'shareLink' && dialogs.shareLink) {
                isOpen ? dialogs.shareLink.open() : dialogs.shareLink.close();
              }
            }}
          />

        </>
      )}
    </BaseCard>
  );
}
