import { Dialog, DialogContent } from '@/components/ui/dialog';
import { DialogProps } from '@/types/ui/dialog';

/**
 * 基本的なダイアログコンポーネント
 * 他のダイアログコンポーネントのベースとして使用される
 */
export function BaseDialog({ isOpen, onClose, children }: DialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        onClick={(e) => e.stopPropagation()}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          document.body.style.pointerEvents = '';
        }}
        className="flex max-h-[90vh] flex-col"
        aria-describedby={undefined}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}
