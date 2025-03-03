import AmazonButton from '@/components/book/AmazonButton';
import RakutenButton from '@/components/book/RakutenButton';
import { BaseDialog } from '@/components/common/dialog/BaseDialog';
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/common/ui/dialog';
import { BookProps, DialogProps } from '@/types';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface Memo {
  id: number;
  memo: string;
  memo_chapter?: number;
  memo_page?: number;
  user_name: string;
  is_current_user: boolean;
  created_at: string;
}

/**
 * 書籍詳細ダイアログコンポーネント
 * 書籍の詳細情報とユーザーのメモを表示する
 */
export function BookDetailDialog({
  title,
  author,
  publisher_name,
  sales_date,
  item_price,
  image_url,
  isbn,
  item_caption,
  isOpen,
  onClose,
}: BookProps & DialogProps) {
  const [memos, setMemos] = useState<Memo[]>([]);

  useEffect(() => {
    if (isOpen && isbn) {
      axios
        .get(`/book/${isbn}/memos`)
        .then((response) => {
          setMemos(response.data);
        })
        .catch((error) => {
          console.error('Failed to fetch memos:', error);
        });
    }
  }, [isOpen, isbn]);

  return (
    <BaseDialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>詳細</DialogTitle>
        <DialogDescription className="sr-only">
          書籍の詳細情報ダイアログ
        </DialogDescription>
      </DialogHeader>

      <div className="hidden-scrollbar flex-1 overflow-y-auto pb-6">
        <div className="space-y-6">
          <div className="mx-auto flex aspect-[3/4] w-full max-w-[200px] shrink-0 items-center justify-center overflow-hidden rounded-md border-2 border-gray-200 shadow-lg">
            <img
              src={image_url || '/placeholder.svg'}
              alt={title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{title}</h2>
            <div className="flex justify-between">
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>{`${sales_date} / ${author} / ${publisher_name}`}</p>
                <p className="text-lg text-red-600">
                  ¥{item_price.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold">書籍を探す</h3>
            <div className="flex gap-2">
              <AmazonButton url={`https://www.amazon.co.jp/s?k=${isbn}`} />
              <RakutenButton
                url={`https://search.rakuten.co.jp/search/mall/${isbn}/`}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold">書籍説明</h3>
            <div className="prose hidden-scrollbar max-h-[300px] overflow-y-auto">
              <p className="text-gray-700">{item_caption}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold">ユーザーのメモ・感想</h3>
            <div className="hidden-scrollbar max-h-[300px] overflow-y-auto">
              {memos.length == 0 ? (<p className="font-bold">まだメモがありません。</p>)
                :
                <>
                  {memos.map((memo) => (
                    <div
                      key={memo.id}
                      className={`mb-2 rounded p-2 ${memo.is_current_user ? 'bg-blue-100' : 'bg-gray-100'}`}
                    >
                      <p className="text-sm font-bold">
                        {memo.is_current_user ? 'あなたのメモ' : memo.user_name}
                      </p>
                      <p className="text-gray-600">{memo.memo}</p>
                      {(memo.memo_chapter || memo.memo_page) && (
                        <p className="text-xs text-gray-500">
                          {memo.memo_chapter && `章: ${memo.memo_chapter}`}
                          {memo.memo_chapter && memo.memo_page && ' | '}
                          {memo.memo_page && `ページ: ${memo.memo_page}`}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">{memo.created_at}</p>
                    </div>
                  ))}
                </>
              }
            </div>
          </div>
        </div>
      </div>
    </BaseDialog>
  );
}
