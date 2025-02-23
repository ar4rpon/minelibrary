<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;


class BookController extends Controller
{
    public function getOrStore(Request $request)
    {
        $request->validate([
            'isbn' => 'required|string',
            'title' => 'required|string',
            'author' => 'required|string',
            'publisher_name' => 'required|string',
            'sales_date' => 'required|string',
            'image_url' => 'required|string',
            'item_caption' => 'required|string',
            'item_price' => 'required|integer',
        ]);

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
            return $existingBook;
        }

        $book = (new Book())->addBook($bookData);
        return $book;
    }
}
