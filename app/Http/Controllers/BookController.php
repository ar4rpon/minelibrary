<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\FavoriteBook;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Enums\ReadStatus;

class BookController extends Controller
{
    public function toggleFavorite(Request $request)
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
