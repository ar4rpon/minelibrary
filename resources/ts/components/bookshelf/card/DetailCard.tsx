import { Separator } from '@/components/common/ui/separator';
import { BookShelfDialogs } from '@/features/bookshelf/components/dialogs/BookShelfDialogs';
import { useBookShelfState } from '@/features/bookshelf/hooks/useBookShelfState';
import { BookShelfBase } from '@/types/bookShelf';
import { Header } from '../elements/Header';
import { UserInfo } from '../elements/UserInfo';
import { BaseCard } from './BaseCard';

interface DetailCardProps extends BookShelfBase {
  userName?: string;
  userImage?: string;
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
  userImage,
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
      <Header
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
    </BaseCard>
  );
}
