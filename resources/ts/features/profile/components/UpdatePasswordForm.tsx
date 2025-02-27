import InputError from '@/components/common/InputError';
import { Button } from '@/components/common/ui/button';
import { Input } from '@/components/common/ui/input';
import { Label } from '@/components/common/ui/label';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

/**
 * パスワード更新フォームコンポーネント
 * ユーザーのパスワード変更機能を提供する
 */
export default function UpdatePasswordForm({
  className = '',
}: {
  className?: string;
}) {
  const passwordInput = useRef<HTMLInputElement>(null);
  const currentPasswordInput = useRef<HTMLInputElement>(null);

  const { data, setData, errors, put, reset, processing, recentlySuccessful } =
    useForm({
      current_password: '',
      password: '',
      password_confirmation: '',
    });

  const updatePassword: FormEventHandler = (e) => {
    e.preventDefault();

    put(route('password.update'), {
      preserveScroll: true,
      onSuccess: () => reset(),
      onError: (errors) => {
        if (errors.password) {
          reset('password', 'password_confirmation');
          passwordInput.current?.focus();
        }

        if (errors.current_password) {
          reset('current_password');
          currentPasswordInput.current?.focus();
        }
      },
    });
  };

  return (
    <section className={className}>
      <header>
        <p className="mt-1 text-sm text-gray-600">
          8文字以上で英数字を含めたパスワードを設定してください。
        </p>
      </header>

      <form onSubmit={updatePassword} className="mt-6 space-y-6">
        <div>
          <Label htmlFor="current_password">Current Password</Label>

          <Input
            id="current_password"
            ref={currentPasswordInput}
            value={data.current_password}
            onChange={(e) => setData('current_password', e.target.value)}
            type="password"
            className="mt-1 block w-full"
            autoComplete="current-password"
          ></Input>

          <InputError message={errors.current_password} className="mt-2" />
        </div>

        <div>
          <Label htmlFor="password">New Password</Label>

          <Input
            id="password"
            ref={passwordInput}
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            type="password"
            className="mt-1 block w-full"
            autoComplete="new-password"
          ></Input>

          <InputError message={errors.password} className="mt-2" />
        </div>

        <div>
          <Label htmlFor="password_confirmation">Confirm Password</Label>

          <Input
            id="password_confirmation"
            value={data.password_confirmation}
            onChange={(e) => setData('password_confirmation', e.target.value)}
            type="password"
            className="mt-1 block w-full"
            autoComplete="new-password"
          ></Input>

          <InputError message={errors.password_confirmation} className="mt-2" />
        </div>

        <div className="flex items-center gap-4">
          <Button disabled={processing}>保存</Button>
          <Transition
            show={recentlySuccessful}
            enter="transition ease-in-out"
            enterFrom="opacity-0"
            leave="transition ease-in-out"
            leaveTo="opacity-0"
          >
            <p className="text-sm text-gray-600">Saved.</p>
          </Transition>
        </div>
      </form>
    </section>
  );
}
