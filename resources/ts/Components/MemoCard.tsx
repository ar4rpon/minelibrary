import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { Separator } from '@/Components/ui/separator';
import { MoreVertical, Pencil, Trash } from 'lucide-react';
import { lazy, memo, Suspense, useState } from 'react';
import { DeleteMemoDialog } from '@/Dialog/Memo/DeleteMemoDialog';
import { EditMemoDialog } from '@/Dialog/Memo/EditMemoDialog';

interface MemoCardProps {
  id: string;
  content: string;
  createdAt: string;
  book: {
    id: string;
    title: string;
    author: string;
    coverUrl: string;
  };
}

// ダイアログコンテンツの遅延読み込み
const DialogContent = lazy(() =>
  import('@/Components/ui/dialog').then((module) => ({
    default: module.DialogContent,
  })),
);

const MemoCard = memo(function MemoCard({
  id = '1',
  content = 'サンプルコンテンツ',
  createdAt = '2024-02-02T10:00:00Z',
  book = {
    id: 'b1',
    title: '本のタイトル',
    author: '著者名',
    coverUrl: '/placeholder.svg',
  },
}: MemoCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleEdit = () => {
    console.log('Edit note:', id);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };
  const confirmEdit = () => {
    console.log('Edit note:', id);
    setDeleteDialogOpen(false);
  };

  const confirmDelete = () => {
    console.log('Delete note:', id);
    setDeleteDialogOpen(false);
  };

  return (
    <Card className="mx-auto w-full overflow-hidden">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-row gap-4">
          <div className="flex items-center">
            <img
              src={book.coverUrl}
              alt={book.title}
              loading="lazy"
              className="h-24 w-20 rounded-md border-2 object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="lg:pl-2">
                  <h2 className="text-xl font-bold">{book.title}</h2>
                  <p className="text-sm text-muted-foreground">{book.author}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(createdAt).toLocaleDateString('ja-JP')}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuItem onClick={handleEdit}>
                      <Pencil className="mr-2 h-4 w-4" />
                      編集
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete}>
                      <Trash className="mr-2 h-4 w-4" />
                      削除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <Separator className="my-4" />

            <p className="line-clamp-4 text-sm">{content}</p>
          </div>
        </div>
      </CardContent>

      <DeleteMemoDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete} />
      <EditMemoDialog
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onConfirm={confirmDelete}
      />

    </Card>
  );
});

export default MemoCard;
