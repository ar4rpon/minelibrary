// 1. React and external libraries
import { MoreVertical, Pencil, Plus, Trash } from 'lucide-react';

// 2. Internal API/services
// (none in this component)

// 3. UI components
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';

// 4. Common components
import { BaseCard } from '@/components/common/BaseCard';

// 5. Domain components
import { CreateMemoDialog } from '@/components/domain/memo/dialogs/CreateMemoDialog';
import { DeleteMemoDialog } from '@/components/domain/memo/dialogs/DeleteMemoDialog';
import { EditMemoDialog } from '@/components/domain/memo/dialogs/EditMemoDialog';

// 6. Hooks
import { useMemoState } from '@/hooks/domain/useMemoState';

// 7. Types
import type { BookData } from '@/types/api';
import type { MemoContent } from '@/types/domain/memo';

// 8. Local/relative imports
// (none in this component)

interface MemoCardProps {
  id: string;
  contents: MemoContent[];
  book: BookData;
}

/**
 * メモカードコンポーネント
 * 書籍情報とメモ一覧を表示する
 */
export function MemoCard({ id, contents, book }: MemoCardProps) {
  const { dialogs, selectedMemo, actions } = useMemoState(id);

  return (
    <BaseCard variant="memo-card">
      <div className="flex flex-row gap-4">
        <div className="flex items-center">
          <img
            src={book.image_url}
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
            <Button variant="outline" size="icon" onClick={dialogs.create.open}>
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
                  <p className="line-clamp-4 flex-1 text-sm">{content.memo}</p>
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
                    <DropdownMenuItem
                      onClick={() => dialogs.edit.open(content)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      編集
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => dialogs.delete.open(content)}
                    >
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

      <DeleteMemoDialog
        isOpen={dialogs.delete.isOpen}
        onClose={dialogs.delete.close}
        onConfirm={actions.deleteMemo}
      />
      <EditMemoDialog
        isOpen={dialogs.edit.isOpen}
        onClose={dialogs.edit.close}
        onEditMemoConfirm={actions.editMemo}
        initialContent={selectedMemo?.memo || ''}
        initialChapter={selectedMemo?.memo_chapter}
        initialPage={selectedMemo?.memo_page}
      />
      <CreateMemoDialog
        isOpen={dialogs.create.isOpen}
        onClose={dialogs.create.close}
        onMemoConfirm={actions.createMemo}
        isbn={id}
      />
    </BaseCard>
  );
}
