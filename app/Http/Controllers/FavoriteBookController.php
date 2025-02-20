<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FavoriteBook;
use Illuminate\Support\Facades\Auth;
use App\Enums\ReadStatus;
use App\Http\Controllers\BookController;

class FavoriteBookController extends Controller
{
    public function toggleFavorite(Request $request)
    {
        $bookController = new BookController();
        $book = $bookController->store($request);

        $user = Auth::user();
        $favoriteBook = FavoriteBook::where('user_id', $user->id)
            ->where('isbn', $book->isbn)
            ->first();

        if ($favoriteBook) {
            $favoriteBook->delete();
            $isFavorite = false;
        } else {
            FavoriteBook::create([
                'user_id' => $user->id,
                'isbn' => $book->isbn,
                'read_status' => ReadStatus::WANTREAD->value,
            ]);
            $isFavorite = true;
        }

        return response()->json(['isFavorite' => $isFavorite]);
    }
    public function getFavoriteStatus(Request $request)
    {
        $request->validate([
            'isbn' => 'required|string',
        ]);

        $user = Auth::user();
        $isFavorite = FavoriteBook::where('user_id', $user->id)
            ->where('isbn', $request->isbn)
            ->exists();

        return response()->json(['isFavorite' => $isFavorite]);
    }
}
