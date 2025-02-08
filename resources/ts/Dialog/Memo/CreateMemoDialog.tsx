import { Button } from '@/Components/ui/button';
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/Components/ui/dialog';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { BaseDialog } from '../BaseDialog';

interface CreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function CreateMemoDialog({
  isOpen,
  onClose,
  onConfirm,
}: CreateDialogProps) {
  return (
    <BaseDialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>作成</DialogTitle>
      </DialogHeader>
      <DialogDescription>
        感想や印象に残ったことをメモしよう！
      </DialogDescription>
      <div className="flex w-full flex-col">
        <div className="grid items-center gap-1.5 text-left">
          <Label className="mb-1" htmlFor="memo">
            Memo
          </Label>
          <Textarea id="memo" placeholder="Memo" />
        </div>
        <div className="mt-6 flex justify-end">
          <Button type="submit" className="mr-4" onClick={onConfirm}>
            作成
          </Button>
          <Button variant="destructive" onClick={onClose}>
            キャンセル
          </Button>
        </div>
      </div>
    </BaseDialog>
  );
}
