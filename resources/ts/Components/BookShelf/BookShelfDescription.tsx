import { Separator } from '@/Components/ui/separator';
import { BookShelfDescriptionProps } from '@/types/bookShelf';
import { ExtendedBookShelfActions } from './Common/BookShelfActions';
import { UserInfo } from './Common/UserInfo';
import { BookShelfDialogs, useBookShelfDialogs } from './Common/BookShelfDialogs';

export default function BookShelfDescription({
  bookShelfId,
  name,
  description,
  isPublic,
  userName,
  userImage,
}: BookShelfDescriptionProps) {
  // ダイアログ状態管理（本の追加ダイアログを含む）
  const [dialogStates, handleDialogState] = useBookShelfDialogs(true);

  return (
    <div className="rounded-sm border border-green-600 bg-white shadow-md min-h-40 mt-4 px-4 py-2 md:py-4">
      <div className="flex items-center justify-between">
        <p className="font-bold text-2xl">{name}</p>

        <ExtendedBookShelfActions
          onAddBook={() => handleDialogState('addBook', true)}
          onEdit={() => handleDialogState('edit', true)}
          onDelete={() => handleDialogState('delete', true)}
        />
      </div>

      <p className="text-md mt-1 text-gray-700">{description}</p>
      <Separator className="my-4" />

      <UserInfo userName={userName} userImage={userImage} />

      {/* ダイアログコンポーネント */}
      <BookShelfDialogs
        bookShelfId={bookShelfId}
        initialName={name}
        initialDescription={description}
        initialIsPublic={isPublic}
        dialogStates={dialogStates}
        onDialogStateChange={handleDialogState}
      />
    </div>
  );
}
