<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Http\Requests\BookStoreRequest;

class BookController extends Controller
{
    public function getOrStore(BookStoreRequest $request)
    {
        $bookData = $request->only([
            'isbn',
            'title',
            'author',
            'publisher_name',
            'sales_date',
            'image_url',
            'item_caption',
            'item_price',
        ]);

        $existingBook = (new Book())->getBookInfo($request->isbn);

        if ($existingBook) {
            return $this->successResponse($existingBook);
        }

        $book = (new Book())->addBook($bookData);
        return $this->successResponse($book);
    }
}
