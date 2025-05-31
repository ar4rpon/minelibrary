import { Button } from '@/components/common/ui/button';
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/common/ui/dialog';
import { BaseDialog } from '@/components/ui/base-dialog';
import { DialogProps } from '@/types';

interface DeleteBookDialogProps extends DialogProps {
  onDeleteBookConfirm: () => Promise<void>;
}

export function DeleteBookDialog({
  isOpen,
  onClose,
  onDeleteBookConfirm,
}: DeleteBookDialogProps) {
  return (
    <BaseDialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>書籍の削除</DialogTitle>
        <DialogDescription>
          この書籍を本棚から削除してもよろしいですか？
          <br />
          この操作は取り消せません。（お気に入り書籍には残ります）
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          キャンセル
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            onDeleteBookConfirm();
            onClose();
          }}
        >
          削除
        </Button>
      </DialogFooter>
    </BaseDialog>
  );
}
