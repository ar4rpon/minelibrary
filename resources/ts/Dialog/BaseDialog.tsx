import { Dialog } from '@/components/common/ui/dialog';
import { DialogProps } from '@/types';
import { lazy, Suspense } from 'react';

const DialogContent = lazy(() =>
  import('@/components/common/ui/dialog').then((module) => ({
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
