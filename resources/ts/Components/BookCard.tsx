import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { ArrowDown, Heart } from 'lucide-react';
import React from 'react';
import { Button } from './ui/button';

interface BookProps {
    title: string;
    author: string;
    description: string;
    publishDate: string;
    genres: string[];
    coverImage: string;
}

const BookCard: React.FC<BookProps> = ({
    title,
    author,
    description,
    publishDate,
    genres,
    coverImage,
}) => {
    return (
        <Card className="flex h-[400px] w-full flex-col">
            <div className="h-[250px] w-full overflow-hidden">
                <img
                    src={coverImage}
                    alt={`Cover of ${title}`}
                    className="h-full w-full rounded-t-lg object-cover"
                />
            </div>
            <CardHeader>
                <CardTitle className="text-xl font-bold">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="mb-2">
                    <p className="inline text-xs text-gray-500">{author}</p>
                    <p className="inline text-xs text-gray-500"> / </p>
                    <p className="inline text-xs text-gray-500">
                        発売日: {publishDate}
                    </p>
                </div>
                <Button
                    size={'sm'}
                    variant="outline"
                    className="hover:text-red-500"
                >
                    <Heart
                        strokeWidth={2}
                        className="hover:text-red-500"
                    ></Heart>
                    お気に入りに追加
                </Button>
                <Button size={'sm'} variant="outline" className="ml-3">
                    <ArrowDown strokeWidth={2} size={10}></ArrowDown>詳細
                </Button>
            </CardContent>
        </Card>
    );
};

export default BookCard;
