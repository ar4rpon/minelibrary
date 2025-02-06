import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog"
import { lazy, Suspense } from 'react';
import { Button } from "@/Components/ui/button"
import { Textarea } from "@/Components/ui/textarea"
import { Label } from "@/Components/ui/label"

const DialogContent = lazy(() =>
  import('@/Components/ui/dialog').then((module) => ({
    default: module.DialogContent,
  })),
);

interface EditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function EditMemoDialog({ isOpen, onClose, onConfirm }: EditDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <Suspense fallback={<div>Loading...</div>}>
        <DialogContent
          onClick={(e) => e.stopPropagation()}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            document.body.style.pointerEvents = '';
          }}>
          <DialogHeader>
            <DialogTitle>編集</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div className="flex mt-4 flex-col w-full">
              <div className="grid items-center text-left gap-1.5">
                <Label className="mb-1" htmlFor="memo" >Memo</Label>
                <Textarea id="memo" placeholder="Memo" >
                  ここに初期値を入力しておく
                </Textarea>
              </div>
              <div className="mt-6 flex justify-end">
                <Button type="submit" className="mr-4" onClick={onConfirm}>決定</Button>
                <Button variant="destructive" onClick={onClose}>キャンセル</Button>
              </div>
            </div>
          </DialogDescription>

        </DialogContent>
      </Suspense>
    </Dialog>
  )
}
