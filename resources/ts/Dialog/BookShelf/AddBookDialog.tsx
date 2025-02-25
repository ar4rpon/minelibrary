import React, { useState } from 'react';
import { Button } from "@/Components/ui/button";
import {
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { BaseDialog } from '@/Dialog/BaseDialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Checkbox } from "@/Components/ui/checkbox";
import { ReadStatus } from '@/types';

type Book = {
  isbn: string;
  title: string;
  author: string;
  publish_date: string;
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

const data: Book[] = [
  {
    isbn: "9784123456789",
    title: "React入門",
    author: "山田太郎",
    publish_date: "2023-01-01",
    read_status: "done_read",
  },
  {
    isbn: "9784987654321",
    title: "TypeScript実践ガイド",
    author: "鈴木花子",
    publish_date: "2023-02-15",
    read_status: "done_read",
  },
  {
    isbn: "9784567890123",
    title: "Next.js開発入門",
    author: "佐藤次郎",
    publish_date: "2023-03-30",
    read_status: "reading",
  },
];

function DataTable({ data, onSelect }: { data: Book[], onSelect: (isbn: string, isChecked: boolean) => void }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>書籍タイトル</TableHead>
            <TableHead>読書ステータス</TableHead>
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
              <TableCell>{book.title}</TableCell>
              <TableCell>{statusConfig[book.read_status].text}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function AddBookDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);

  const handleClose = () => setIsOpen(false);

  const handleSelect = (isbn: string, isChecked: boolean) => {
    setSelectedBooks(prev =>
      isChecked
        ? [...prev, isbn]
        : prev.filter(selectedIsbn => selectedIsbn !== isbn)
    );
  };

  const handleAddBooks = () => {
    console.log('Selected books:', selectedBooks);
    handleClose();
  };

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>本棚に追加</Button>
      <BaseDialog isOpen={isOpen} onClose={handleClose}>
        <DialogHeader>
          <DialogTitle>本棚に書籍を追加</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <DataTable data={data} onSelect={handleSelect} />
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={handleAddBooks}>選択した本を追加</Button>
        </div>
      </BaseDialog>
    </>
  );
}
