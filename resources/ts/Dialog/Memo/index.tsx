import { Dialog } from "@/Components/ui/dialog";
import { lazy, Suspense } from 'react';

const DialogContent = lazy(() =>
  import('@/Components/ui/dialog').then((module) => ({
    default: module.DialogContent,
  })),
);

interface MemoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function MemoDialog({ isOpen, onClose, children }: MemoDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <Suspense fallback={<div>Loading...</div>}>
        <DialogContent
          onClick={(e) => e.stopPropagation()}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            document.body.style.pointerEvents = '';
          }}
        >
          {children}
        </DialogContent>
      </Suspense>
    </Dialog>
  );
}
