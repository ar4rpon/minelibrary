import InputError from '@/components/common/InputError';
import { BaseDialog } from '@/components/ui/base-dialog';
import { Button } from '@/components/ui/button';
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDialogState } from '@/hooks/common/useDialogState';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

/**
 * アカウント削除フォームコンポーネント
 * ユーザーアカウントの削除機能を提供する
 */
export default function DeleteUserForm({
  className = '',
}: {
  className?: string;
}) {
  const deleteDialog = useDialogState();
  const passwordInput = useRef<HTMLInputElement>(null);

  const {
    data,
    setData,
    delete: destroy,
    processing,
    reset,
    errors,
    clearErrors,
  } = useForm({
    password: '',
  });

  const confirmUserDeletion = () => {
    deleteDialog.open();
  };

  const deleteUser: FormEventHandler = (e) => {
    e.preventDefault();

    destroy(route('profile.destroy'), {
      preserveScroll: true,
      onSuccess: () => closeDialog(),
      onError: () => passwordInput.current?.focus(),
      onFinish: () => reset(),
    });
  };

  const closeDialog = () => {
    deleteDialog.close();
    clearErrors();
    reset();
  };

  return (
    <section className={`space-y-6 ${className}`}>
      <header>
        <p className="mt-1 text-sm text-gray-600">
          アカウントに関する全ての情報を削除します。削除後復元出来ません。
        </p>
      </header>
      <Button onClick={confirmUserDeletion} variant="destructive">
        アカウント削除
      </Button>
      <BaseDialog isOpen={deleteDialog.isOpen} onClose={closeDialog}>
        <DialogHeader>
          <DialogTitle>アカウント削除確認</DialogTitle>
        </DialogHeader>
        <form onSubmit={deleteUser}>
          <DialogDescription>
            Once your account is deleted, all of its resources and data will be
            permanently deleted. Please enter your password to confirm you would
            like to permanently delete your account.
          </DialogDescription>

          <div className="mt-6">
            <Label htmlFor="password" className="sr-only">
              Password
            </Label>

            <Input
              id="password"
              type="password"
              name="password"
              ref={passwordInput}
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              className="mt-1 block w-3/4"
              placeholder="Password"
            ></Input>

            <InputError message={errors.password} className="mt-2" />
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={closeDialog} variant="secondary">
              キャンセル
            </Button>

            <Button
              variant="destructive"
              className="ms-3"
              disabled={processing}
            >
              アカウント削除
            </Button>
          </div>
        </form>
      </BaseDialog>
    </section>
  );
}
