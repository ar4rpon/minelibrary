import React, { useState, useEffect } from 'react';
import { Button } from "@/Components/ui/button";
import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/Components/ui/dialog";
import { BaseDialog } from '@/Dialog/BaseDialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Checkbox } from "@/Components/ui/checkbox";
import { DialogProps, ReadStatus } from '@/types';
import axios from 'axios';

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

function DataTable({ data, onSelect }: { data: Book[], onSelect: (isbn: string, isChecked: boolean) => void }) {
  return (
    <div className="rounded-md border overflow-hidden w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead className='w-4/6'>書籍タイトル</TableHead>
            <TableHead className='px-1 w-1/6'>著者</TableHead>
            <TableHead className='px-1 w-1/6'>読書ステータス</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((book) => (
            <TableRow key={book.isbn}>
              <TableCell>
                <Checkbox
                  onCheckedChange={(checked) => onSelect(book.isbn, checked as boolean)}
                />
              </TableCell>
              <TableCell className=' w-4/6'>{book.title}</TableCell>
              <TableCell className='px-1 w-1/6'>{book.author}</TableCell>
              <TableCell className='px-1 w-1/6'>{statusConfig[book.read_status].text}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
interface AddBookDialogProps extends DialogProps {
  AddBooksConfirm: any;
}

export function AddBookDialog({ isOpen, onClose, AddBooksConfirm }: AddBookDialogProps) {

  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchFavoriteBooks();
    }
  }, [isOpen]);

  const fetchFavoriteBooks = async () => {
    try {
      const response = await axios.get('/book-shelf/get/favorite-books');
      setFavoriteBooks(response.data.map((favorite: any) => ({
        isbn: favorite.isbn,
        title: favorite.book.title,
        author: favorite.book.author,
        sales_date: favorite.book.sales_date,
        read_status: favorite.read_status,
      })));
    } catch (error) {
      console.error('Failed to fetch favorite books:', error);
    }
  };



  const handleSelect = (isbn: string, isChecked: boolean) => {
    setSelectedBooks(prev =>
      isChecked
        ? [...prev, isbn]
        : prev.filter(selectedIsbn => selectedIsbn !== isbn)
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
      <div className="py-4 h-[90vh] w-full overflow-auto hidden-scrollbar ">
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
