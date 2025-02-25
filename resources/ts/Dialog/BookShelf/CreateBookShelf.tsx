import { BaseDialog } from "../BaseDialog";
import { DialogHeader, DialogTitle, DialogDescription } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { DialogProps } from "@/types";
import { useState } from "react";

interface CreateBookShelfDialogProps extends DialogProps {
  bookShelfDiscription?: string;
  onCreateBookShelfConfirm: (book_shelf_name: string, discription: string) => void;
}

export function CreateBookShelfDialog({
  isOpen,
  onClose,
  onCreateBookShelfConfirm,
}: CreateBookShelfDialogProps) {
  const [bookShelfName, setBookShelfName] = useState("");
  const [bookShelfDiscription, setBookShelfDiscription] = useState("");


  const handleConfirm = () => {
    onCreateBookShelfConfirm(
      bookShelfName,
      bookShelfDiscription
    );
    onClose();
  };

  return (
    <BaseDialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>本棚作成</DialogTitle>
      </DialogHeader>
      <DialogDescription asChild>
        <div className="flex mt-4 flex-col w-full">
          <div className="grid items-center text-left gap-1.5">
            <Label className="mb-1" htmlFor="bookshelfname">本棚名</Label>
            <Input
              id="BookShelfName"
              placeholder="本棚の名前"
              value={bookShelfName}
              onChange={(e) => setBookShelfName(e.target.value)}
            />
          </div>
          <div className="grid items-center text-left gap-1.5 mt-4">
            <Label className="mb-1" htmlFor="bookshelfdiscription">本棚の説明</Label>
            <Textarea
              id="Discription"
              placeholder="本棚の概要や説明など"
              value={bookShelfDiscription}
              onChange={(e) => setBookShelfDiscription(e.target.value)}
            ></Textarea>
          </div>
          <div className="mt-6 flex justify-end">
            <Button type="submit" className="mr-4" onClick={handleConfirm}>作成</Button>
            <Button variant="destructive" onClick={onClose}>キャンセル</Button>
          </div>
        </div>
      </DialogDescription>
    </BaseDialog>
  );
}
