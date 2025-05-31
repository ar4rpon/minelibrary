import { Dialog, DialogContent } from '@/components/common/ui/dialog';

interface BaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * ベースダイアログコンポーネント
 * カスタムダイアログのベースとして使用する
 */
export function BaseDialog({
  isOpen,
  onClose,
  children,
  className,
}: BaseDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={className}>{children}</DialogContent>
    </Dialog>
  );
}
