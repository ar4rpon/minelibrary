import { Button } from '@/components/common/ui/button';
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/common/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/common/ui/select';
import { DialogProps, ReadStatus } from '@/types';
import { BaseDialog } from '../BaseDialog';

interface ReadStatusProps {
  readStatus: ReadStatus;
  onChangeValue: any;
}

export function UpdateReadStatusDialog({
  isOpen,
  onClose,
  onConfirm,
  readStatus,
  onChangeValue,
}: DialogProps & ReadStatusProps) {
  return (
    <BaseDialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>書籍ステータス更新</DialogTitle>
      </DialogHeader>
      <DialogDescription asChild>
        <div className="mt-4 flex w-full flex-col">
          <div className="mt-4 grid items-center gap-1.5 text-left">
            <Select value={readStatus} onValueChange={(e) => onChangeValue(e)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="ステータスを更新" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="want_read">読みたい</SelectItem>
                  <SelectItem value="reading">読んでる</SelectItem>
                  <SelectItem value="done_read">読んだ</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-6 flex justify-end">
            <Button type="submit" className="mr-4" onClick={onConfirm}>
              更新
            </Button>
            <Button variant="destructive" onClick={onClose}>
              キャンセル
            </Button>
          </div>
        </div>
      </DialogDescription>
    </BaseDialog>
  );
}
