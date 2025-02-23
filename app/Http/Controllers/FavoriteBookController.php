<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FavoriteBook;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\BookController;

class FavoriteBookController extends Controller
{
    protected $bookController;

    public function __construct(BookController $bookController)
    {
        $this->bookController = $bookController;
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
