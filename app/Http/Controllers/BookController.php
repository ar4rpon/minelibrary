<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;


class BookController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'isbn' => 'required|string',
            'title' => 'required|string',
            'author' => 'required|string',
            'publisher_name' => 'required|string',
            'sales_date' => 'required|string',
            'image_url' => 'required|string',
        ]);

        $book = Book::firstOrCreate(
            ['isbn' => $request->isbn],
            [
                'title' => $request->title,
                'author' => $request->author,
                'publisher_name' => $request->publisher_name,
                'sales_date' => $request->sales_date,
                'image_url' => $request->image_url,
            ]
        );
        return $book;
    }
}
