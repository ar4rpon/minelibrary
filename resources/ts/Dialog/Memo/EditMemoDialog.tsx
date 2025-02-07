import { MemoDialog } from './index';
import { DialogHeader, DialogTitle, DialogDescription } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";

interface EditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function EditMemoDialog({ isOpen, onClose, onConfirm }: EditDialogProps) {
  return (
    <MemoDialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>編集</DialogTitle>
      </DialogHeader>
      <DialogDescription>
        <div className="flex mt-4 flex-col w-full">
          <div className="grid items-center text-left gap-1.5">
            <Label className="mb-1" htmlFor="memo">Memo</Label>
            <Textarea id="memo" placeholder="Memo">
              ここに初期値を入力しておく
            </Textarea>
          </div>
          <div className="mt-6 flex justify-end">
            <Button type="submit" className="mr-4" onClick={onConfirm}>決定</Button>
            <Button variant="destructive" onClick={onClose}>キャンセル</Button>
          </div>
        </div>
      </DialogDescription>
    </MemoDialog>
  );
}
