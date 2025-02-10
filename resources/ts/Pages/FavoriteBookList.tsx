import BookCard from '@/Components/Book/BookCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import DefaultLayout from '@/Layouts/DefaultLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function FavoriteBookList() {
  const [sortBy, setSortBy] = useState('newDate');
  return (
    <DefaultLayout header="FavoriteBookList">
      <Head title="FavoriteBookList" />
      <div className="mb-4">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="並び替え" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newDate">追加が新しい順</SelectItem>
            <SelectItem value="oldDate">追加が古い順</SelectItem>
          </SelectContent>
        </Select>
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


    </DefaultLayout>
  );
}
