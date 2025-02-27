<?php

namespace App\Http\Controllers;

use App\Models\BookShelf;
use App\Models\FavoriteBook;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use Illuminate\Http\Request;

class BookShelfController extends Controller
{
    public function show($book_shelf_id)
    {
        $user = Auth::user();
        $bookShelf = BookShelf::where('id', $book_shelf_id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $books = BookShelf::getBooks($book_shelf_id)->map(function ($book) use ($user) {
            $favoriteBook = FavoriteBook::where('isbn', $book->isbn)
                ->where('user_id', $user->id)
                ->first();
            return [
                'isbn' => $book->isbn,
                'read_status' => $favoriteBook ? $favoriteBook->read_status : null,
                'book' => [
                    'title' => $book->title,
                    'author' => $book->author,
                    'publisher_name' => $book->publisher_name,
                    'sales_date' => $book->sales_date,
                    'image_url' => $book->image_url,
                    'item_caption' => $book->item_caption,
                    'item_price' => $book->item_price,
                ],
            ];
        });

        return Inertia::render('BookShelf/BookShelfDetail', [
            'bookShelf' => $bookShelf,
            'books' => $books,
        ]);
    }

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

    public function update(Request $request, $id)
    {
        $request->validate([
            'book_shelf_name' => 'required|string',
            'description' => 'required|string',
            'is_public' => 'required|boolean',
        ]);
        $bookShelf = BookShelf::findOrFail($id);
        $bookShelf->updateName($request->book_shelf_name);
        $bookShelf->updateDescription($request->description);
        $bookShelf->updateIsPublic($request->is_public);
    }

    public function getMyAll()
    {
        $user = Auth::user();

        $bookshelves = BookShelf::where('user_id', $user->id)
            ->select(
                'id',
                'book_shelf_name',
                'description',
                'is_public'
            )
            ->get();

        return response()->json($bookshelves);
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

    public function getBooks(Request $request)
    {

        $request->validate([
            'book_shelf_id' => 'required|exists:book_shelves,id',
        ]);

        $books = BookShelf::getBooks($request->book_shelf_id)->map(function ($book) {
            $user = Auth::user();
            $favoriteBook = FavoriteBook::where('isbn', $book->isbn)
                ->where('user_id', $user->id)
                ->first();
            return [
                'isbn' => $book->isbn,
                'read_status' => $favoriteBook->read_status,
                'book' => [
                    'title' => $book->title,
                    'author' => $book->author,
                    'publisher_name' => $book->publisher_name,
                    'sales_date' => $book->sales_date,
                    'image_url' => $book->image_url,
                    'item_caption' => $book->item_caption,
                    'item_price' => $book->item_price,
                ],
            ];
        });

        return response()->json($books);
    }

    public function destroy($id)
    {
        $user = Auth::user();
        $bookShelf = BookShelf::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $bookShelf->delete();

        return response()->json(['message' => 'Book shelf deleted successfully'], 200);
    }

    public function removeBook(Request $request)
    {
        $request->validate([
            'book_shelf_id' => 'required|exists:book_shelves,id',
            'isbn' => 'required|string|exists:books,isbn',
        ]);

        $user = Auth::user();
        $bookShelf = BookShelf::where('id', $request->book_shelf_id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $bookShelf->removeBook($request->isbn);

        return response()->json(['message' => 'Book removed successfully'], 200);
    }
}
