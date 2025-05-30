<?php

namespace App\Http\Controllers;

use App\Http\Requests\BookStoreRequest;
use App\Services\BookService;

class BookController extends Controller
{
    private BookService $bookService;

    public function __construct(BookService $bookService)
    {
        $this->bookService = $bookService;
    }

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

        $book = $this->bookService->getOrCreateBook($bookData);
        return $this->successResponse($book);
    }
}
