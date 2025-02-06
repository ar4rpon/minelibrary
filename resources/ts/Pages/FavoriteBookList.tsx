import BookCard from '@/Components/BookCard';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Separator } from '@/Components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { MoreVertical, Pencil, Trash } from 'lucide-react';
import { Button } from '@/Components/ui/button';

export default function FavoriteBookList() {
  return (
    <AuthenticatedLayout header="FavoriteBookList">
      <Head title="FavoriteBookList" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-sm border border-green-600 bg-white shadow-md">
            <h2 className="px-2 py-2 text-xl font-semibold md:px-4 md:py-4 md:text-2xl">
              お気に入り本一覧
            </h2>
          </div>
          <div className="rounded-sm border border-green-600 bg-white shadow-md min-h-40 mt-4 px-4 py-2  md:py-4">
            <div className="flex items-center justify-between">
              <p className="font-bold text-2xl">本棚名</p>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuItem >
                    <Pencil className="mr-2 h-4 w-4" />
                    編集
                  </DropdownMenuItem>
                  <DropdownMenuItem >
                    <Trash className="mr-2 h-4 w-4" />
                    削除
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            </div>
            <p className="text-md mt-1 text-gray-700">本棚説明本棚説明本棚説明本棚説明本棚説明本棚説明本棚説明本棚説明本棚説明本棚説明本棚説明</p>
            <Separator className="my-4" />

            <div className="flex items-center">
              <img className='w-9 h-9 rounded-3xl' src="https://placehold.jp/150x150.png" alt="" />
              <p className="ml-2 md:ml-4 text-md font-semibold text-gray-600">ユーザー名</p>
            </div>


          </div>
          <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-4 lg:grid-cols-3">
            <BookCard
              title="本のタイトル"
              author="著者名"
              publisher="出版社"
              publishDate="2024年2月2日"
              price={1500}
              imageUrl="https://shop.r10s.jp/book/cabinet/9163/9784297129163_1_4.jpg"
            />

            <BookCard
              title="本のタイトル"
              author="著者名"
              publisher="出版社"
              publishDate="2024年2月2日"
              price={1500}
              imageUrl="https://shop.r10s.jp/book/cabinet/9163/9784297129163_1_4.jpg"
            />

            <BookCard
              title="本のタイトル"
              author="著者名"
              publisher="出版社"
              publishDate="2024年2月2日"
              price={15000}
              imageUrl="https://shop.r10s.jp/book/cabinet/9163/9784297129163_1_4.jpg"
            />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
