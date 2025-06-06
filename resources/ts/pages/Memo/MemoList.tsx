import { DefaultLayout } from '@/components/common/layout';
import { MemoCard } from '@/components/domain/memo/card/MemoCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BookProps } from '@/types/domain/book';
import { MemoContent } from '@/types/domain/memo';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface MemoData {
  id: string;
  contents: MemoContent[];
  book: BookProps;
}

/**
 * メモ一覧ページ
 * ユーザーのメモ一覧を表示する
 */
export default function MemoList() {
  const { memos, sortBy: initialSortBy } = usePage().props as unknown as {
    memos: MemoData[];
    sortBy: string;
  };
  const [sortBy, setSortBy] = useState(initialSortBy);

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    router.get(
      route('memos.index'),
      { sortBy: newSortBy },
      { preserveState: true },
    );
  };

  return (
    <DefaultLayout header="メモ一覧">
      <Head title="MemoList" />

      <div className="mb-4">
        <Select value={sortBy} onValueChange={handleSortChange}>
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
        {memos ? (
          <>
            {memos.map((memo) => (
              <MemoCard
                key={memo.id}
                id={memo.id}
                contents={memo.contents}
                book={memo.book}
              />
            ))}
          </>
        ) : (
          <p className="font-bold">まだメモはありません</p>
        )}
      </div>
    </DefaultLayout>
  );
}
