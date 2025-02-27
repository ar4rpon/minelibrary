import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { BookShelfBase } from '@/types/bookShelf';
import { BaseBookShelfCard } from './BaseBookShelfCard';
import { BookShelfImage } from './BookShelfImage';
import { BookShelfHeader } from './BookShelfHeader';
import { useBookShelfState } from './hooks/useBookShelfState';
import { BookShelfDialogs } from './BookShelfDialogs';

interface DefaultBookShelfCardProps extends BookShelfBase {
  image?: string;
}

/**
 * デフォルトバリアントの本棚カードコンポーネント
 */
export function DefaultBookShelfCard({
  bookShelfId,
  name,
  description,
  isPublic,
  image,
}: DefaultBookShelfCardProps) {
  const { dialogs } = useBookShelfState();

  return (
    <BaseBookShelfCard variant="card" bookShelfId={bookShelfId} name={name} description={description} isPublic={isPublic}>
      <div className="flex flex-row gap-4">
        <BookShelfImage
          imageUrl={image || ''}
          name={name}
          variant="card"
        />

        <div className="flex flex-1 flex-col">
          <BookShelfHeader
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
    </BaseBookShelfCard>
  );
}
