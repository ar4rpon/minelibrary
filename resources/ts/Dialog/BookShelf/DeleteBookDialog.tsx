import { BaseDialog } from '../BaseDialog';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { DialogProps } from '@/types';

interface CreateBookShelfDialogProps extends DialogProps {
  onDeleteBookConfirm: () => any;
}

export function DeleteBookDialog({ isOpen, onClose, onDeleteBookConfirm }: CreateBookShelfDialogProps) {
  return (
    <BaseDialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>書籍の削除</DialogTitle>
        <DialogDescription>
          この書籍を本棚から削除してもよろしいですか？この操作は取り消せません。
          （お気に入り書籍には残ります）
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>キャンセル</Button>
        <Button variant="destructive" onClick={() => {
          onDeleteBookConfirm();
          onClose();
        }}>削除</Button>
      </DialogFooter>
    </BaseDialog>
  );
}
