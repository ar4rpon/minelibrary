import { Button } from '@/components/common/ui/button';
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/common/ui/dialog';
import { BaseDialog } from '@/components/ui/base-dialog';
import { DialogProps } from '@/types';

interface DeleteMemoDialogProps extends DialogProps {
  onConfirm: () => void;
}

export function DeleteMemoDialog({
  isOpen,
  onClose,
  onConfirm,
}: DeleteMemoDialogProps) {
  return (
    <BaseDialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>メモの削除</DialogTitle>
        <DialogDescription>
          このメモを削除してもよろしいですか？この操作は取り消せません。
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
