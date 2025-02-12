import AmazonButton from '@/Components/Book/AmazonButton';
import FavoriteIcon from '@/Components/Book/FavoriteIcon';
import RakutenButton from '@/Components/Book/RakutenButton';
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/Components/ui/dialog';
import { BookProps, DialogProps } from '@/types';
import { useState } from 'react';
import { BaseDialog } from '../BaseDialog';


export function BookDetailDialog({
  title = '本のタイトル',
  author = '著者名',
  publisherName = '出版社',
  salesDate = '2024年2月2日',
  itemPrice = 1500,
  largeImageUrl = 'https://shop.r10s.jp/book/cabinet/9163/9784297129163_1_4.jpg',
  isbn = '',
  itemCaption = '説明はありません',
  isOpen,
  onClose,
  onConfirm,
}: BookProps & DialogProps) {
  const [isFavorite, setIsFavorite] = useState(false);

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
              src={largeImageUrl || '/placeholder.svg'}
              alt={title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{title}</h2>
            <div className="flex justify-between">
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>{`${salesDate} / ${author} / ${publisherName}`}</p>
                <p className="text-lg text-red-600">
                  ¥{itemPrice.toLocaleString()}
                </p>
              </div>
              <FavoriteIcon
                isFavorite={isFavorite}
                onClick={() => setIsFavorite(!isFavorite)}
              />
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
              <p className="text-gray-700">
                {itemCaption}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold">ユーザーのメモ・感想</h3>
            <div className="max-h-[300px] overflow-y-auto">
              <p className="text-gray-600">
                ここにユーザーのメモや感想が入ります。ダミーテキストダミーテキスト...
              </p>
            </div>
          </div>
        </div>
      </div>
    </BaseDialog>
  );
}
