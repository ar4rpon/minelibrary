import { Button } from '@/components/common/ui/button';
import { BookShelfDialogs } from '@/features/bookshelf/components/dialogs/BookShelfDialogs';
import { useBookShelfState } from '@/features/bookshelf/hooks/useBookShelfState';
import { BookShelfBase } from '@/types/bookShelf';
import { Link } from '@inertiajs/react';
import { Header } from '../elements/Header';
import { Image } from '../elements/Image';
import { BaseCard } from './BaseCard';

interface DefaultCardProps extends BookShelfBase {
  image?: string;
}

/**
 * デフォルトバリアントの本棚カードコンポーネント
 */
export function DefaultCard({
  bookShelfId,
  name,
  description,
  isPublic,
  image,
}: DefaultCardProps) {
  const { dialogs } = useBookShelfState();

  return (
    <BaseCard
      variant="card"
      bookShelfId={bookShelfId}
      name={name}
      description={description}
      isPublic={isPublic}
    >
      <div className="flex flex-row gap-4">
        <Image imageUrl={image || ''} name={name} variant="card" />

        <div className="flex flex-1 flex-col">
          <Header
            name={name}
            description={description}
            variant="card"
            onEdit={dialogs.edit.open}
            onDelete={dialogs.delete.open}
          />

          <Link href={`/book-shelf/${bookShelfId}`}>
            <Button className="mt-4 text-sm">詳細を見る</Button>
          </Link>
        </div>
      </div>

      <BookShelfDialogs
        bookShelfId={bookShelfId}
        initialName={name}
        initialDescription={description}
        initialIsPublic={isPublic}
        dialogStates={{
          edit: dialogs.edit.isOpen,
          delete: dialogs.delete.isOpen,
        }}
        onDialogStateChange={(dialogKey, isOpen) => {
          if (dialogKey === 'edit') {
            isOpen ? dialogs.edit.open() : dialogs.edit.close();
          } else if (dialogKey === 'delete') {
            isOpen ? dialogs.delete.open() : dialogs.delete.close();
          }
        }}
      />
    </BaseCard>
  );
}
