import { BaseDialog } from "../BaseDialog";
import { DialogHeader, DialogTitle, DialogDescription } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { DialogProps } from "@/types";



export function CreateBookShelfDialog({ isOpen, onClose, onConfirm }: DialogProps) {
  return (
    <BaseDialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>本棚作成</DialogTitle>
      </DialogHeader>
      <DialogDescription>
        <div className="flex mt-4 flex-col w-full">
          <div className="grid items-center text-left gap-1.5">
            <Label className="mb-1" htmlFor="bookshelfname">本棚名</Label>
            <Input id="bookshelfname" placeholder="本棚名" />
          </div>
          <div className="grid items-center text-left gap-1.5 mt-4">
            <Label className="mb-1" htmlFor="bookshelfdiscription">本棚の説明</Label>
            <Textarea id="bookshelfdiscription" placeholder="本棚の説明"></Textarea>
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
