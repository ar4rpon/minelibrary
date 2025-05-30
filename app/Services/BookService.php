<?php

namespace App\Services;

use App\Models\Book;

class BookService
{
    /**
     * 本の情報を取得、存在しない場合は新規登録
     *
     * @param array $bookData
     * @return Book
     */
    public function getOrCreateBook(array $bookData): Book
    {
        $existingBook = (new Book())->getBookInfo($bookData['isbn']);

        if ($existingBook) {
            return $existingBook;
        }

        return (new Book())->addBook($bookData);
    }
}