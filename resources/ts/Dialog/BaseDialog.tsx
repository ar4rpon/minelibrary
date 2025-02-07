import { Dialog } from "@/Components/ui/dialog";
import { lazy, Suspense } from 'react';

const DialogContent = lazy(() =>
  import('@/Components/ui/dialog').then((module) => ({
    default: module.DialogContent,
  })),
);

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function BaseDialog({ isOpen, onClose, children }: DialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <Suspense fallback={<div>Loading...</div>}>
        <DialogContent
          onClick={(e) => e.stopPropagation()}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            document.body.style.pointerEvents = '';
          }}
          className="max-h-[90vh] flex flex-col"
        >
          {children}
        </DialogContent>
      </Suspense>
    </Dialog>
  );
}
