import { Button } from '@/Components/ui/button';
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/Components/ui/dialog';
import { Textarea } from '@/Components/ui/textarea';
import { BaseDialog } from '../BaseDialog';
import { DialogProps } from '@/types';


export function EditMemoDialog({
  isOpen,
  onClose,
  onConfirm,
}: DialogProps) {
  return (
    <BaseDialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>編集</DialogTitle>
      </DialogHeader>
      <div className="mt-4 flex w-full flex-col">
        <div className="grid items-center gap-1.5 text-left">
          <DialogDescription>メモを編集する</DialogDescription>
          <Textarea
            id="memo"
            placeholder="Memo"
            defaultValue="ここに初期値を入力しておく"
          />
        </div>
        <div className="mt-6 flex justify-end">
          <Button type="submit" className="mr-4" onClick={onConfirm}>
            決定
          </Button>
          <Button variant="destructive" onClick={onClose}>
            キャンセル
          </Button>
        </div>
      </div>
    </BaseDialog>
  );
}
