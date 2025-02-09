import MemoCard from '@/Components/MemoCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select';
import DefaultLayout from '@/Layouts/DefaultLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function MemoList() {
  const sampleBook = {
    id: 'b1',
    title: 'サンプルブック',
    author: '山田太郎',
    coverUrl: 'https://shop.r10s.jp/book/cabinet/9163/9784297129163_1_4.jpg',
  };

  const memoData = [
    {
      id: '1',
      contents: [
        'サンプルコンテンツ1',
        'サンプルコンテンツ2',
        'サンプルコンテンツ3',
      ],
      createdAt: '2024-02-02T10:00:00Z',
      book: sampleBook,
    },
    {
      id: '2',
      contents: [
        'サンプルコンテンツ4',
        'サンプルコンテンツ5',
        'サンプルコンテンツ6',
      ],
      createdAt: '2024-02-02T10:00:00Z',
      book: sampleBook,
    },
    {
      id: '3',
      contents: [
        'サンプルコンテンツ7',
        'サンプルコンテンツ8',
        'サンプルコンテンツ9',
      ],
      createdAt: '2024-02-02T10:00:00Z',
      book: sampleBook,
    },
  ];

  const [sortBy, setSortBy] = useState('date');

  return (
    <DefaultLayout header="メモ一覧">
      <Head title="MemoList" />

      <div className="mb-4">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="並び替え" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">メモ追加が新しい順</SelectItem>
            <SelectItem value="title">書籍タイトル順</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-4">
        {memoData.map((memo) => (
          <MemoCard
            key={memo.id}
            id={memo.id}
            contents={memo.contents}
            createdAt={memo.createdAt}
            book={memo.book}
          />
        ))}
      </div>
    </DefaultLayout>
  );
}
