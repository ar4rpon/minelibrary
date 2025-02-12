import { BaseDialog } from '../BaseDialog';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { DialogProps } from '@/types';


export function DeleteMemoDialog({ isOpen, onClose, onConfirm }: DialogProps) {
  return (
    <BaseDialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>メモの削除</DialogTitle>
        <DialogDescription>
          このメモを削除してもよろしいですか？この操作は取り消せません。
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>キャンセル</Button>
        <Button variant="destructive" onClick={onConfirm}>削除</Button>
      </DialogFooter>
    </BaseDialog>
  );
}
