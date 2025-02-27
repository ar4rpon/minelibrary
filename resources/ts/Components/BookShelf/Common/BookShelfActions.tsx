import { Button } from '@/Components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { BookPlus, MoreVertical, Pencil, Share, Trash } from 'lucide-react';
import { BookShelfActionsProps, ExtendedBookShelfActionsProps } from '@/types/bookShelf';

// 基本的なアクション（編集・削除）
export function BookShelfActions({ onEdit, onDelete }: BookShelfActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem onClick={onEdit}>
          <Pencil className="mr-2 h-4 w-4" />
          編集
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete}>
          <Trash className="mr-2 h-4 w-4" />
          削除
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// 拡張アクション（本の追加・共有機能を含む）
export function ExtendedBookShelfActions({
  onAddBook,
  onEdit,
  onDelete,
  onShare = () => {
    // TODO: 共有機能の実装
    console.log('共有機能は未実装です');
  },
}: ExtendedBookShelfActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="shrink-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem onClick={onAddBook}>
          <BookPlus className="mr-2 h-4 w-4" />
          本を追加する
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit}>
          <Pencil className="mr-2 h-4 w-4" />
          本棚を編集する
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onShare}>
          <Share className="mr-2 h-4 w-4" />
          本棚を共有する
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete}>
          <Trash className="mr-2 h-4 w-4" />
          本棚を削除
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
