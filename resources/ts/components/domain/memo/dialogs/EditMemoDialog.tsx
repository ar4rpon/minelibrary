import { BaseDialog } from '@/components/common/ui/base-dialog';
import { Button } from '@/components/common/ui/button';
import { DialogHeader, DialogTitle } from '@/components/common/ui/dialog';
import { Input } from '@/components/common/ui/input';
import { Textarea } from '@/components/common/ui/textarea';
import { DialogProps } from '@/types';
import { useEffect, useState } from 'react';

interface EditMemoDialogProps extends DialogProps {
  initialContent: string;
  initialChapter?: number;
  initialPage?: number;
  onEditMemoConfirm: (memo: string, chapter?: number, page?: number) => void;
}

export function EditMemoDialog({
  isOpen,
  onClose,
  onEditMemoConfirm,
  initialContent,
  initialChapter,
  initialPage,
}: EditMemoDialogProps) {
  const [memo, setMemo] = useState(initialContent);
  const [chapter, setChapter] = useState(initialChapter?.toString() || '');
  const [page, setPage] = useState(initialPage?.toString() || '');

  useEffect(() => {
    if (isOpen) {
      setMemo(initialContent);
      setChapter(initialChapter?.toString() || '');
      setPage(initialPage?.toString() || '');
    }
  }, [isOpen, initialContent, initialChapter, initialPage]);

  const handleConfirm = () => {
    onEditMemoConfirm(
      memo,
      Number(chapter) || undefined,
      Number(page) || undefined,
    );
    onClose();
  };

  return (
    <BaseDialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>編集</DialogTitle>
      </DialogHeader>
      <div className="mt-4 flex w-full flex-col">
        <div className="grid items-center gap-1.5 text-left">
          <Input
            type="number"
            placeholder="章"
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
          />
          <Input
            type="number"
            placeholder="ページ"
            value={page}
            onChange={(e) => setPage(e.target.value)}
          />
          <Textarea
            id="memo"
            placeholder="Memo"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </div>
        <div className="mt-6 flex justify-end">
          <Button type="submit" className="mr-4" onClick={handleConfirm}>
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
