import { Button } from '@/Components/ui/button';
import { Checkbox } from '@/Components/ui/checkbox';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/Components/ui/form';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <Form>
                <form onSubmit={submit} className="space-y-4">
                    <FormField
                        name="email"
                        render={() => (
                            <FormItem>
                                <Label htmlFor="email">Email</Label>
                                <FormControl>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        autoComplete="username"
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                    />
                                </FormControl>
                                <FormMessage>{errors.email}</FormMessage>
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="password"
                        render={() => (
                            <FormItem>
                                <Label htmlFor="password">Password</Label>
                                <FormControl>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        autoComplete="current-password"
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                    />
                                </FormControl>
                                <FormMessage>{errors.password}</FormMessage>
                            </FormItem>
                        )}
                    />

                    <div className="mt-4 block">
                        <label className="flex items-center">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>,
                                ) => setData('remember', e.target.checked)}
                            />
                            <span className="ms-2 text-sm text-gray-600">
                                Remember me
                            </span>
                        </label>
                    </div>

                    <div className="mt-4 flex items-center justify-end">
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Forgot your password?
                            </Link>
                        )}

                        <Button
                            className="ml-4"
                            type="submit"
                            disabled={processing}
                        >
                            Log in
                        </Button>
                    </div>
                </form>
            </Form>
        </GuestLayout>
    );
}
