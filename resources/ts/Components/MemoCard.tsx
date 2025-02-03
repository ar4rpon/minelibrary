import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/Components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { Separator } from '@/Components/ui/separator';
import { MoreVertical, Pencil, Trash } from 'lucide-react';
import { lazy, memo, Suspense, useState, useEffect } from 'react';

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

  const handleEdit = () => {
    console.log('Edit note:', id);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    console.log('Delete note:', id);
    setDeleteDialogOpen(false);
  };

  return (
    <Card className="mx-auto w-full overflow-hidden">
      <CardContent className="p-4 md:p-6" >
        <div className="flex flex-col gap-4 md:flex-row lg:block">
          <div className="flex items-center">
            <img
              src={book.coverUrl}
              alt={book.title}
              loading="lazy"
              className="h-24 w-20 object-cover lg:hidden rounded-md border-2"
            />
          </div>
          <div className="flex flex-1 flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  loading="lazy"
                  className="mt-2 hidden h-24 w-20 object-cover lg:inline-block rounded-md border-2"
                />
                <div>
                  <h2 className="text-xl font-bold sm:text-2xl">
                    {book.title}
                  </h2>
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

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <Suspense fallback={<div>Loading...</div>}>
          <DialogContent
            onClick={(e) => e.stopPropagation()}
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              document.body.style.pointerEvents = '';
            }}
            className="focus:outline-none"
          >
            <DialogHeader>
              <DialogTitle>メモの削除</DialogTitle>
              <DialogDescription>
                このメモを削除してもよろしいですか？この操作は取り消せません。
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                キャンセル
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                削除
              </Button>
            </DialogFooter>
          </DialogContent>
        </Suspense>
      </Dialog>
    </Card>
  );
});

export default MemoCard;
