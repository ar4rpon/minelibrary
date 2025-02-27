import { Button } from '@/components/common/ui/button';
import { CardDescription, CardTitle } from '@/components/common/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/common/ui/dropdown-menu';
import {
  BookShelfActionsProps,
  ExtendedBookShelfActionsProps,
} from '@/types/bookShelf';
import { BookPlus, MoreVertical, Pencil, Share, Trash } from 'lucide-react';

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

interface HeaderProps {
  name: string;
  description: string;
  variant?: 'card' | 'description';
  onEdit: () => void;
  onDelete: () => void;
  onAddBook?: () => void;
}

/**
 * 本棚のタイトルと説明を表示するコンポーネント
 */
export function Header({
  name,
  description,
  variant = 'card',
  onEdit,
  onDelete,
  onAddBook,
}: HeaderProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <CardTitle
          className={`${
            variant === 'description'
              ? 'text-2xl font-bold'
              : 'text-xl font-bold'
          }`}
        >
          {name}
        </CardTitle>

        {variant === 'description' && onAddBook ? (
          <ExtendedBookShelfActions
            onAddBook={onAddBook}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ) : (
          <BookShelfActions onEdit={onEdit} onDelete={onDelete} />
        )}
      </div>

      <CardDescription
        className={`${
          variant === 'description'
            ? 'text-md mt-1 text-gray-700'
            : 'text-sm text-gray-600'
        }`}
      >
        {description}
      </CardDescription>
    </div>
  );
}
