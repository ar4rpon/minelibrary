import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { Heart, Plus } from 'lucide-react';
import { useState } from 'react';

interface BookCardProps {
  title: string;
  author: string;
  publisher: string;
  publishDate: string;
  price: number;
  imageUrl: string;
}

export default function BookCard({
  title = '本のタイトル',
  author = '著者名',
  publisher = '出版社',
  publishDate = '2024年2月2日',
  price = 1500,
  imageUrl = 'https://shop.r10s.jp/book/cabinet/9163/9784297129163_1_4.jpg',
}: BookCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [bookshelves] = useState(['本棚1', '本棚2', '本棚3']);

  return (
    <Card className="mx-auto w-full max-w-4xl overflow-hidden p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row lg:flex-col">
        <div className="mx-auto flex aspect-[3/4] w-full max-w-[200px] shrink-0 items-center justify-center overflow-hidden rounded-md  border-gray-200 shadow-lg border-2">
          <img
            src={imageUrl || '/placeholder.svg'}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-1 flex-col justify-between space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-bold sm:text-left sm:text-2xl">
              {title}
            </h2>
            <div className="space-y-1 text-sm text-muted-foreground sm:text-left">
              <p>{`${publishDate} / ${author} / ${publisher}`}</p>
              <p className="text-lg font-semibold">¥{price.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex-1">
                  本棚に追加
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                {bookshelves.map((shelf) => (
                  <DropdownMenuItem key={shelf}>{shelf}</DropdownMenuItem>
                ))}
                <DropdownMenuItem className="justify-between">
                  本棚を作成する
                  <Plus />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart
                className={`h-5 w-5 ${isFavorite ? 'fill-current text-red-500' : 'text-muted-foreground'}`}
              />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
