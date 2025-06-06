import InputError from '@/components/common/InputError';
import { DefaultLayout } from '@/components/common/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Register() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route('register'), {
      onFinish: () => reset('password', 'password_confirmation'),
    });
  };

  return (
    <DefaultLayout>
      <Head title="Register" />

      <form onSubmit={submit}>
        <div>
          <Label htmlFor="name">Name</Label>

          <Input
            id="name"
            name="name"
            value={data.name}
            className="mt-1 block w-full"
            autoComplete="name"
            onChange={(e) => setData('name', e.target.value)}
            required
          ></Input>

          <InputError message={errors.name} className="mt-2" />
        </div>

        <div className="mt-4">
          <Label htmlFor="email">Email</Label>

          <Input
            id="email"
            type="email"
            name="email"
            value={data.email}
            className="mt-1 block w-full"
            autoComplete="username"
            onChange={(e) => setData('email', e.target.value)}
            required
          ></Input>

          <InputError message={errors.email} className="mt-2" />
        </div>

        <div className="mt-4">
          <Label htmlFor="password">Password</Label>

          <Input
            id="password"
            type="password"
            name="password"
            value={data.password}
            className="mt-1 block w-full"
            autoComplete="new-password"
            onChange={(e) => setData('password', e.target.value)}
            required
          ></Input>

          <InputError message={errors.password} className="mt-2" />
        </div>

        <div className="mt-4">
          <Label htmlFor="password_confirmation">Confirm Password</Label>

          <Input
            id="password_confirmation"
            type="password"
            name="password_confirmation"
            value={data.password_confirmation}
            className="mt-1 block w-full"
            autoComplete="new-password"
            onChange={(e) => setData('password_confirmation', e.target.value)}
            required
          ></Input>

          <InputError message={errors.password_confirmation} className="mt-2" />
        </div>

        <div className="mt-4 flex items-center justify-end">
          <Link
            href={route('login')}
            className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Already registered?
          </Link>

          <Button className="ms-4" disabled={processing}>
            登録
          </Button>
        </div>
      </form>
    </DefaultLayout>
  );
}
