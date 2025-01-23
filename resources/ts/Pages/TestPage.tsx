import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';

interface BookData {
    Items: Array<{
        Item: {
            title: string
            author: string;
            isbn: string;
            itemPrice: string;
            publisherName: string;
            largeImageUrl: string;
            itemUrl: string;
        }
    }>;
    count: number;
    page: number;
    first: number;
    last: number;
    hits: number;
}

export default function TestPage({ data }: { data: BookData }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    TestPage
                </h2>
            }
        >
            <Head title="TestPage" />

            <div className="p-6">
                <h3 className="text-lg font-bold mb-4">検索結果 ({data.count}件)</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data?.Items?.map((item, index) => (
                        <div key={index} className="border rounded-lg p-4">
                            {item?.Item?.largeImageUrl && (
                                <img
                                    src={item.Item.largeImageUrl}
                                    alt={item.Item.author || 'Book image'}
                                    className="w-full h-48 object-contain mb-2"
                                />
                            )}
                            <div className="font-bold">{item?.Item?.title || 'Unknown author'}</div>
                            <div className="text-sm">{item?.Item?.author || 'Unknown author'}</div>

                            <div className="text-sm text-gray-600">{item?.Item?.publisherName || 'Unknown publisher'}</div>
                            <div className="text-sm">価格: {item?.Item?.itemPrice || 'N/A'}円</div>
                            {item?.Item?.itemUrl && (
                                <a
                                    href={item.Item.itemUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline text-sm"
                                >
                                    商品ページへ
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
