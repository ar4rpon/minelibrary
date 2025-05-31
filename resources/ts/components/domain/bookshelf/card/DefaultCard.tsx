import { BaseCard } from '@/components/common/BaseCard';
import { Button } from '@/components/ui/button';
import { BookShelfDialogs } from '@/features/bookshelf/components/dialogs/BookShelfDialogs';
import { useBookShelfState } from '@/features/bookshelf/hooks/useBookShelfState';
import { BookShelfBase } from '@/types/bookShelf';
import { Link } from '@inertiajs/react';
import { Header } from '../elements/Header';
import { Image } from '../elements/Image';

interface DefaultCardProps extends BookShelfBase {
  image?: string;
  owner?: {
    id: number;
    name: string;
  };
  type?: 'my' | 'favorite';
}

/**
 * デフォルトバリアントの本棚カードコンポーネント
 */
export function DefaultCard({
  bookShelfId,
  name,
  description,
  isPublic,
  owner,
  type = 'my',
}: DefaultCardProps) {
  const { dialogs } = useBookShelfState();

  // タイプに応じたURLを生成
  const detailUrl =
    type === 'my'
      ? `/book-shelf/${bookShelfId}`
      : owner
        ? `/user/${owner.id}/book-shelf/${bookShelfId}`
        : `/book-shelf/${bookShelfId}`;

  // 所有者かどうかを判定
  const isOwner = type === 'my';

  return (
    <BaseCard variant="bookshelf-card">
      <div className="flex flex-row gap-4">
        <Image variant="card" />

        <div className="flex flex-1 flex-col">
          <Header
            name={name}
            description={description}
            variant="card"
            onEdit={dialogs.edit.open}
            onDelete={dialogs.delete.open}
            isShared={!isOwner} // 所有者以外は編集・削除ボタンを表示しない
          />

          <Link href={detailUrl}>
            <Button className="mt-4 text-sm">詳細を見る</Button>
          </Link>
        </div>
      </div>

      {isOwner && (
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
      )}
    </BaseCard>
  );
}
