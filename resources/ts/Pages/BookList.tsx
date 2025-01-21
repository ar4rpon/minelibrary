import BookCard from '@/Components/BookCard';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function BookList() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    BookList
                </h2>
            }
        >
            <Head title="BookList" />
            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5].map((_, index) => (
                        <div key={index} className="w-full">
                            <BookCard
                                title="タイトル"
                                author="著者"
                                description="説明"
                                publishDate="2022/12/22"
                                genres={['TypeScript', 'React']}
                                coverImage="https://placehold.jp/200x200.png"
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            You're logged in!
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
