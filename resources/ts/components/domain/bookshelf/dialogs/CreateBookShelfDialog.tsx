import { BaseDialog } from '@/components/common/dialog/BaseDialog';
import { Button } from '@/components/ui/button';
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DialogProps } from '@/types/ui/dialog';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

interface CreateBookShelfDialogProps extends DialogProps {
  bookShelfDescription?: string;
  onCreateBookShelfConfirm: (
    book_shelf_name: string,
    description: string,
  ) => void;
  isLoading?: boolean;
}

export function CreateBookShelfDialog({
  isOpen,
  onClose,
  onCreateBookShelfConfirm,
  isLoading = false,
}: CreateBookShelfDialogProps) {
  const [bookShelfName, setBookShelfName] = useState('');
  const [bookShelfDescription, setBookShelfDescription] = useState('');

  const handleConfirm = () => {
    if (!bookShelfName.trim()) {
      return;
    }

    onCreateBookShelfConfirm(bookShelfName, bookShelfDescription);

    // onCloseはBookShelfList.tsxで処理するため、ここでは呼び出さない
  };

  // ダイアログが閉じられたときにフォームをリセット
  const handleClose = () => {
    if (!isLoading) {
      setBookShelfName('');
      setBookShelfDescription('');
      onClose();
    }
  };

  return (
    <BaseDialog isOpen={isOpen} onClose={handleClose}>
      <DialogHeader>
        <DialogTitle>本棚作成</DialogTitle>
      </DialogHeader>
      <DialogDescription asChild>
        <div className="mt-4 flex w-full flex-col">
          <div className="grid items-center gap-1.5 text-left">
            <Label className="mb-1" htmlFor="bookshelfname">
              本棚名 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="BookShelfName"
              placeholder="本棚の名前"
              value={bookShelfName}
              onChange={(e) => setBookShelfName(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="mt-4 grid items-center gap-1.5 text-left">
            <Label className="mb-1" htmlFor="bookshelfdescription">
              本棚の説明
            </Label>
            <Textarea
              id="Description"
              placeholder="本棚の概要や説明など"
              value={bookShelfDescription}
              onChange={(e) => setBookShelfDescription(e.target.value)}
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
