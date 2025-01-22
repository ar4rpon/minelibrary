import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function TestPage() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    TestPage
                </h2>
            }
        >
            <Head title="TestPage" />
            content
        </AuthenticatedLayout>
    );
}
