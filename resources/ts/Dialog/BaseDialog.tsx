import { Dialog } from '@/Components/ui/dialog';
import { lazy, Suspense } from 'react';
import { DialogProps } from '@/types';

const DialogContent = lazy(() =>
  import('@/Components/ui/dialog').then((module) => ({
    default: module.DialogContent,
  })),
);



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
          className="flex max-h-[90vh] flex-col"
          aria-describedby={undefined}
        >
          {children}
        </DialogContent>
      </Suspense>
    </Dialog>
  );
}
