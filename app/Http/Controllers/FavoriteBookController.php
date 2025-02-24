<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FavoriteBook;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\BookController;

class FavoriteBookController extends Controller
{
    protected $bookController;

    public function __construct(BookController $bookController)
    {
        $this->bookController = $bookController;
    }
    public function index()
    {
        $user = Auth::user();
        $favorites = FavoriteBook::where('user_id', $user->id)
            ->with('book')
            ->get()
            ->map(function ($favorite) {
                return [
                    'isbn' => $favorite->isbn,
                    'read_status' => $favorite->read_status,
                    'created_at' => $favorite->created_at,
                    'book' => [
                        'title' => $favorite->book->title,
                        'author' => $favorite->book->author,
                        'publisher_name' => $favorite->book->publisher_name,
                        'sales_date' => $favorite->book->sales_date,
                        'image_url' => $favorite->book->image_url,
                        'item_caption' => $favorite->book->item_caption,
                        'item_price' => $favorite->book->item_price,
                    ],
                ];
            });

        return Inertia::render('FavoriteBookList', [
            'favorites' => $favorites
        ]);
    }

    public function updateReadStatus(Request $request)
    {
        $user = Auth::user();
        $favorites = FavoriteBook::where('user_id', $user->id)
            ->where('isbn', $request->isbn);
        $favorites->updateReadStatus($request->readStatus);
        return response()->json(['readStatus' => $request->readStatus]);
    }

    public function toggleFavorite(Request $request)
    {
        $book = $this->bookController->getOrStore($request);
        $user = Auth::user();

        $isFavorite = FavoriteBook::isFavorite($book->isbn, $user->id);

        if ($isFavorite) {
            FavoriteBook::where('isbn', $book->isbn)
                ->where('user_id', $user->id)
                ->delete();
            $isFavorite = false;
        } else {
            FavoriteBook::addFavorite($book->isbn, $user->id);
            $isFavorite = true;
        }

        return response()->json(['isFavorite' => $isFavorite]);
    }

    public function getFavoriteStatus(Request $request)
    {
        $user = Auth::user();
        $isFavorite = FavoriteBook::isFavorite($request->isbn, $user->id);

        return response()->json(['isFavorite' => $isFavorite]);
    }
}
