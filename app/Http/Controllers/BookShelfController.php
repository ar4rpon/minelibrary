<?php

namespace App\Http\Controllers;

use App\Models\BookShelf;
use Illuminate\Support\Facades\Auth;

use Illuminate\Http\Request;

class BookShelfController extends Controller
{
    public function store(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'book_shelf_name' => 'required|string',
            'description' => 'required|string',
        ]);
        $bookShelf = (new BookShelf())->add(
            [
                'user_id' => $user->id,
                'book_shelf_name' => $request->book_shelf_name,
                'description' => $request->description,
                'is_public' => true
            ]
        );
        return $bookShelf;
    }

    public function addBooks(Request $request)
    {
        $request->validate([
            'book_shelf_id' => 'required|exists:book_shelves,id',
            'isbns' => 'required|array',
            'isbns.*' => 'required|string|exists:books,isbn'
        ]);

        $bookShelf = BookShelf::findOrFail($request->book_shelf_id);

        foreach ($request->isbns as $isbn) {
            $bookShelf->addBook($isbn);
        }

        return response()->json(['message' => 'Books added successfully'], 200);
    }
}
