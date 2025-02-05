import { lazy, Suspense } from 'react';
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';

const DialogContent = lazy(() =>
  import('@/Components/ui/dialog').then((module) => ({
    default: module.DialogContent,
  })),
);

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteMemoDialog({ isOpen, onClose, onConfirm }: DeleteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <Suspense fallback={<div>Loading...</div>}>
        <DialogContent
          onClick={(e) => e.stopPropagation()}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            document.body.style.pointerEvents = '';
          }}
        >
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
        </DialogContent>
      </Suspense>
    </Dialog>
  );
};
