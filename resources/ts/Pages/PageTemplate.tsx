import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function PageTemplate() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    PageTemplate
                </h2>
            }
        >
            <Head title="PageTemplate" />
            content
        </AuthenticatedLayout>
    );
}
