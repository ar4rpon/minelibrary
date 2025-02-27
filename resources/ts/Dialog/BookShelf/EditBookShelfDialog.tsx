import { Button } from '@/Components/ui/button';
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { DialogProps } from '@/types';
import { useState, useEffect } from 'react';
import { BaseDialog } from '../BaseDialog';
import { Switch } from '@/Components/ui/switch';

interface EditBookShelfDialogProps extends DialogProps {
  initialName: string;
  initialDescription: string;
  initialIsPublic: boolean;
  onEditBookShelfConfirm: (name: string, description: string, isPublic: boolean) => void;
}

export function EditBookShelfDialog({
  isOpen,
  onClose,
  onEditBookShelfConfirm,
  initialName,
  initialDescription,
  initialIsPublic,
}: EditBookShelfDialogProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [isPublic, setIsPublic] = useState(initialIsPublic);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setDescription(initialDescription);
      setIsPublic(initialIsPublic);
    }
  }, [isOpen, initialName, initialDescription, initialIsPublic]);

  const handleConfirm = () => {
    onEditBookShelfConfirm(name, description, isPublic);
    onClose();
  };

  return (
    <BaseDialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>本棚を編集</DialogTitle>
      </DialogHeader>
      <DialogDescription>
        本棚の情報を編集してください。
      </DialogDescription>
      <div className="flex w-full flex-col">
        <div className="mt-2 grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="name">本棚の名前</Label>
          <Input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mt-2 grid w-full items-center gap-1.5">
          <Label htmlFor="description">説明</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mt-2 flex items-center space-x-2">
          <Switch
            id="public"
            checked={isPublic}
            onCheckedChange={setIsPublic}
          />
          <Label htmlFor="public">公開する</Label>
        </div>
        <div className="mt-6 flex justify-end">
          <Button type="submit" className="mr-4" onClick={handleConfirm}>
            更新
          </Button>
          <Button variant="destructive" onClick={onClose}>
            キャンセル
          </Button>
        </div>
      </div>
    </BaseDialog>
  );
}
