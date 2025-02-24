import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { Separator } from '@/Components/ui/separator';
import { CreateMemoDialog } from '@/Dialog/Memo/CreateMemoDialog';
import { DeleteMemoDialog } from '@/Dialog/Memo/DeleteMemoDialog';
import { EditMemoDialog } from '@/Dialog/Memo/EditMemoDialog';
import { BookProps, MemoContent } from '@/types';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { MoreVertical, Pencil, Plus, Trash } from 'lucide-react';
import { memo, useState } from 'react';

interface MemoCardProps {
  id: string;
  contents: MemoContent[];
  book: BookProps;
}

const MemoCard = memo(function MemoCard({ id, contents, book }: MemoCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedMemo, setSelectedMemo] = useState<MemoContent | null>(null);

  const handleEdit = (content: MemoContent) => {
    setSelectedMemo(content);
    setEditDialogOpen(true);
  };

  const handleDelete = (content: MemoContent) => {
    setSelectedMemo(content);
    setDeleteDialogOpen(true);
  };

  const confirmEdit = async (
    updatedMemo: string,
    chapter?: number,
    page?: number,
  ) => {
    if (!selectedMemo) return;
    try {
      await axios.put(`/memo/${selectedMemo.id}`, {
        memo: updatedMemo,
        memo_chapter: chapter,
        memo_page: page,
      });
      router.reload();
    } catch (error) {
      console.error('Failed to edit memo:', error);
    }
    setEditDialogOpen(false);
  };

  const confirmDelete = async () => {
    if (!selectedMemo) return;
    try {
      await axios.delete(`/memo/${selectedMemo.id}`);
      router.reload();
    } catch (error) {
      console.error('Failed to delete memo:', error);
    }
    setDeleteDialogOpen(false);
  };

  const confirmCreate = async (
    memo: string,
    chapter?: number,
    page?: number,
  ) => {
    try {
      await axios.post('/memo/create', {
        isbn: id,
        memo,
        memo_chapter: chapter,
        memo_page: page,
      });
      router.reload();
    } catch (error) {
      console.error('Failed to create memo:', error);
    }
    setCreateDialogOpen(false);
  };

  return (
    <Card className="mx-auto w-full overflow-hidden">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-row gap-4">
          <div className="flex items-center">
            <img
              src={book.imageUrl}
              alt={book.title}
              loading="lazy"
              className="h-24 w-20 rounded-md border-2 object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col space-y-4">
            <div className="flex justify-between space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold">{book.title}</h2>
                  <p className="text-sm text-muted-foreground">{book.author}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCreateDialogOpen(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Separator className="my-4" />

            {contents.map((content) => (
              <div
                key={content.id}
                className="flex flex-col items-start justify-between border-b pb-2"
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex flex-col">
                    <p className="line-clamp-4 flex-1 text-sm">
                      {content.memo}
                    </p>
                    {(content.memo_chapter || content.memo_page) && (
                      <p className="mt-1 text-xs text-gray-500">
                        {content.memo_chapter && ` ${content.memo_chapter}章`}
                        {content.memo_chapter && content.memo_page && ' | '}
                        {content.memo_page && `${content.memo_page}P`}
                      </p>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <DropdownMenuItem onClick={() => handleEdit(content)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        編集
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(content)}>
                        <Trash className="mr-2 h-4 w-4" />
                        削除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <DeleteMemoDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
      />
      <EditMemoDialog
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onEditMemoConfirm={confirmEdit}
        initialContent={selectedMemo?.memo || ''}
        initialChapter={selectedMemo?.memo_chapter}
        initialPage={selectedMemo?.memo_page}
      />
      <CreateMemoDialog
        isOpen={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onMemoConfirm={confirmCreate}
        isbn={id}
      />
    </Card>
  );
});

export default MemoCard;
