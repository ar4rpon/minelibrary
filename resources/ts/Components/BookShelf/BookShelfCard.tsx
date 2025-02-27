import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/Components/ui/card';
import { Link } from '@inertiajs/react';
import { Button } from '../ui/button';
import { BookShelfCardProps } from '@/types/bookShelf';
import { BookShelfActions } from './Common/BookShelfActions';
import { BookShelfDialogs, useBookShelfDialogs } from './Common/BookShelfDialogs';

const DEFAULT_BOOK_IMAGE = 'https://placehold.jp/150x150.png';

function BookShelfCard({
  bookShelfId,
  name,
  description,
  isPublic,
  image = DEFAULT_BOOK_IMAGE,
}: BookShelfCardProps) {
  // ダイアログ状態管理
  const [dialogStates, handleDialogState] = useBookShelfDialogs();

  return (
    <Card className="mx-auto w-full overflow-hidden">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-row gap-4">
          <BookImage src={image} alt={`${name}の表紙`} />
          <BookContent
            title={name}
            description={description}
            bookShelfId={bookShelfId}
            onEdit={() => handleDialogState('edit', true)}
            onDelete={() => handleDialogState('delete', true)}
          />
        </div>

        {/* ダイアログコンポーネント */}
        <BookShelfDialogs
          bookShelfId={bookShelfId}
          initialName={name}
          initialDescription={description}
          initialIsPublic={isPublic}
          dialogStates={dialogStates}
          onDialogStateChange={handleDialogState}
        />
      </CardContent>
    </Card>
  );
}

interface BookImageProps {
  src: string;
  alt: string;
}

function BookImage({ src, alt }: BookImageProps) {
  return (
    <div className="flex items-center">
      <img
        src={src}
        alt={alt}
        className="h-24 w-20 rounded-md border-2 object-cover"
      />
    </div>
  );
}

interface BookContentProps {
  title: string;
  description: string;
  bookShelfId: number;
  onEdit: () => void;
  onDelete: () => void;
}

function BookContent({
  title,
  description,
  bookShelfId,
  onEdit,
  onDelete,
}: BookContentProps) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex justify-between">
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <BookShelfActions onEdit={onEdit} onDelete={onDelete} />
      </div>

      <CardDescription className="text-sm text-gray-600">
        {description}
      </CardDescription>

      <Link href={`/book-shelf/${bookShelfId}`}>
        <Button className="mt-4 text-sm">詳細を見る</Button>
      </Link>
    </div>
  );
}

export default BookShelfCard;
