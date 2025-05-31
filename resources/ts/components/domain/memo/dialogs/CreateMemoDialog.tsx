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
import { useState } from 'react';

interface CreateMemoDialogProps extends DialogProps {
  isbn: string;
  onMemoConfirm: (memo: string, chapter?: number, page?: number) => void;
}

export function CreateMemoDialog({
  isOpen,
  onClose,
  onMemoConfirm,
}: CreateMemoDialogProps) {
  const [chapter, setChapter] = useState<string>('');
  const [page, setPage] = useState<string>('');
  const [memo, setMemo] = useState<string>('');

  const handleConfirm = () => {
    onMemoConfirm(
      memo,
      Number(chapter) || undefined,
      Number(page) || undefined,
    );
    setChapter('');
    setPage('');
    setMemo('');
    onClose();
  };

  return (
    <BaseDialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>作成</DialogTitle>
      </DialogHeader>
      <DialogDescription>
        感想や印象に残ったことをメモしよう！
      </DialogDescription>
      <div className="flex w-full flex-col">
        <div className="mt-2 grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="chapter">章（任意）</Label>
          <Input
            type="number"
            id="chapter"
            placeholder="chapter"
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
          />
        </div>
        <div className="mt-2 grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="page">ページ（任意）</Label>
          <Input
            type="number"
            id="page"
            placeholder="page"
            value={page}
            onChange={(e) => setPage(e.target.value)}
          />
        </div>
        <div className="mt-2 grid items-center gap-1.5 text-left">
          <Label className="mb-1" htmlFor="memo">
            Memo
          </Label>
          <Textarea
            id="memo"
            placeholder="Memo"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </div>
        <div className="mt-6 flex justify-end">
          <Button type="submit" className="mr-4" onClick={handleConfirm}>
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
