import { BaseDialog } from "../BaseDialog";
import { DialogHeader, DialogTitle, DialogDescription } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";

interface CreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function CreateMemoDialog({ isOpen, onClose, onConfirm }: CreateDialogProps) {
  return (
    <BaseDialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>作成</DialogTitle>
      </DialogHeader>
      <DialogDescription>
        <div className="flex mt-4 flex-col w-full">
          <div className="grid items-center text-left gap-1.5">
            <Label className="mb-1" htmlFor="memo">Memo</Label>
            <Textarea id="memo" placeholder="Memo" />
            <p className="text-sm text-muted-foreground">
              感想や印象に残ったことをメモしよう！
            </p>
          </div>
          <div className="mt-6 flex justify-end">
            <Button type="submit" className="mr-4" onClick={onConfirm}>作成</Button>
            <Button variant="destructive" onClick={onClose}>キャンセル</Button>
          </div>
        </div>
      </DialogDescription>
    </BaseDialog>
  );
}
