import { MemoDialog } from './index';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteMemoDialog({ isOpen, onClose, onConfirm }: DeleteDialogProps) {
  return (
    <MemoDialog isOpen={isOpen} onClose={onClose}>
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
    </MemoDialog>
  );
}
