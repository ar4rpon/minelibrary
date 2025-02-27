import { BaseDialog } from "../BaseDialog";
import { DialogHeader, DialogTitle, DialogDescription } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { DialogProps } from "@/types";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface CreateBookShelfDialogProps extends DialogProps {
  bookShelfDiscription?: string;
  onCreateBookShelfConfirm: (book_shelf_name: string, discription: string) => void;
  isLoading?: boolean;
}

export function CreateBookShelfDialog({
  isOpen,
  onClose,
  onCreateBookShelfConfirm,
  isLoading = false,
}: CreateBookShelfDialogProps) {
  const [bookShelfName, setBookShelfName] = useState("");
  const [bookShelfDiscription, setBookShelfDiscription] = useState("");

  const handleConfirm = () => {
    if (!bookShelfName.trim()) {
      return;
    }

    onCreateBookShelfConfirm(
      bookShelfName,
      bookShelfDiscription
    );

    // onCloseはBookShelfList.tsxで処理するため、ここでは呼び出さない
  };

  // ダイアログが閉じられたときにフォームをリセット
  const handleClose = () => {
    if (!isLoading) {
      setBookShelfName("");
      setBookShelfDiscription("");
      onClose();
    }
  };

  return (
    <BaseDialog isOpen={isOpen} onClose={handleClose}>
      <DialogHeader>
        <DialogTitle>本棚作成</DialogTitle>
      </DialogHeader>
      <DialogDescription asChild>
        <div className="flex mt-4 flex-col w-full">
          <div className="grid items-center text-left gap-1.5">
            <Label className="mb-1" htmlFor="bookshelfname">本棚名 <span className="text-red-500">*</span></Label>
            <Input
              id="BookShelfName"
              placeholder="本棚の名前"
              value={bookShelfName}
              onChange={(e) => setBookShelfName(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="grid items-center text-left gap-1.5 mt-4">
            <Label className="mb-1" htmlFor="bookshelfdiscription">本棚の説明</Label>
            <Textarea
              id="Discription"
              placeholder="本棚の概要や説明など"
              value={bookShelfDiscription}
              onChange={(e) => setBookShelfDiscription(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              className="mr-4"
              onClick={handleConfirm}
              disabled={isLoading || !bookShelfName.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  作成中...
                </>
              ) : (
                '作成'
              )}
            </Button>
            <Button
              variant="destructive"
              onClick={handleClose}
              disabled={isLoading}
            >
              キャンセル
            </Button>
          </div>
        </div>
      </DialogDescription>
    </BaseDialog>
  );
}
