import { Button } from '@/Components/ui/button';
import { Checkbox } from '@/Components/ui/checkbox';
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/Components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table';
import { BaseDialog } from '@/Dialog/BaseDialog';
import { getFavoriteBooks } from '@/Services/bookShelfService';
import { DialogProps, ReadStatus } from '@/types';
import { useEffect, useState } from 'react';

type Book = {
  isbn: string;
  title: string;
  author: string;
  sales_date: string;
  read_status: ReadStatus;
};

const statusConfig = {
  want_read: {
    text: '読みたい',
  },
  reading: {
    text: '読んでる',
  },
  done_read: {
    text: '読んだ',
  },
};

function DataTable({
  data,
  onSelect,
}: {
  data: Book[];
  onSelect: (isbn: string, isChecked: boolean) => void;
}) {
  return (
    <div className="w-full overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead className="w-4/6">書籍タイトル</TableHead>
            <TableHead className="w-1/6 px-1">著者</TableHead>
            <TableHead className="w-1/6 px-1">読書ステータス</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((book) => (
            <TableRow key={book.isbn}>
              <TableCell>
                <Checkbox
                  onCheckedChange={(checked) =>
                    onSelect(book.isbn, checked as boolean)
                  }
                />
              </TableCell>
              <TableCell className="w-4/6">{book.title}</TableCell>
              <TableCell className="w-1/6 px-1">{book.author}</TableCell>
              <TableCell className="w-1/6 px-1">
                {statusConfig[book.read_status].text}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
interface AddBookDialogProps extends DialogProps {
  AddBooksConfirm: (selectedIsbns: string[]) => Promise<void>;
}

export function AddBookDialog({
  isOpen,
  onClose,
  AddBooksConfirm,
}: AddBookDialogProps) {
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchFavoriteBooks();
    }
  }, [isOpen]);

  const fetchFavoriteBooks = async () => {
    const books = await getFavoriteBooks();
    setFavoriteBooks(books);
  };

  const handleSelect = (isbn: string, isChecked: boolean) => {
    setSelectedBooks((prev) =>
      isChecked
        ? [...prev, isbn]
        : prev.filter((selectedIsbn) => selectedIsbn !== isbn),
    );
  };

  const handleAddBooks = () => {
    AddBooksConfirm(selectedBooks);
    // 値を初期化
    setSelectedBooks([]);
  };

  return (
    <BaseDialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>本棚に書籍を追加</DialogTitle>
      </DialogHeader>
      <div className="hidden-scrollbar h-[90vh] w-full overflow-auto py-4">
        <DataTable data={favoriteBooks} onSelect={handleSelect} />
      </div>
      <DialogFooter className="sm:justify-end">
        <Button variant="outline" onClick={onClose}>
          キャンセル
        </Button>
        <Button onClick={handleAddBooks}>選択した本を追加</Button>
      </DialogFooter>
    </BaseDialog>
  );
}
