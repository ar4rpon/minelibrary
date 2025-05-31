import { BaseDialog } from '@/components/common/dialog/BaseDialog';
import { Button } from '@/components/ui/button';
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DialogProps } from '@/types';

export function DeleteBookShelfDialog({
  isOpen,
  onClose,
  onConfirm,
}: DialogProps) {
  return (
    <BaseDialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>本棚の削除</DialogTitle>
        <DialogDescription>
          この本棚を削除してもよろしいですか？
          <br />
          この操作は取り消せません。 （お気に入り書籍は残ります）
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          キャンセル
        </Button>
        <Button variant="destructive" onClick={onConfirm}>
          削除
        </Button>
      </DialogFooter>
    </BaseDialog>
  );
}
