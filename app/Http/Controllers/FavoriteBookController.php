<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\FavoriteBookToggleRequest;
use App\Http\Requests\FavoriteBookStatusRequest;
use App\Models\FavoriteBook;
use App\Models\Book;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FavoriteBookController extends Controller
{

    public function index(Request $request)
    {
        $sortBy = $request->input('sortBy', 'newDate');
        $favorites = $this->getFavoritesData($sortBy);

        return Inertia::render('features/book/pages/FavoriteBookList', [
            'favorites' => $favorites,
            'sortBy' => $sortBy,
        ]);
    }

    public function getFavorites()
    {
        $favorites = $this->getFavoritesData();
        return response()->json($favorites);
    }

    /**
     * お気に入り本のデータを取得する共通メソッド（重複ロジック統一）
     *
     * @param string|null $sortBy
     * @return \Illuminate\Support\Collection
     */
    private function getFavoritesData(?string $sortBy = null)
    {
        $user = Auth::user();

        // N+1問題解決: 必要な本の情報のみを効率的に取得
        $query = FavoriteBook::where('user_id', $user->id)
            ->with([
                'book' => function($query) {
                    $query->select('isbn', 'title', 'author', 'publisher_name', 'sales_date', 'image_url', 'item_caption', 'item_price');
                }
            ]);

        if ($sortBy === 'newDate') {
            $query->orderBy('created_at', 'desc');
        } elseif ($sortBy === 'oldDate') {
            $query->orderBy('created_at', 'asc');
        }

        return $query->get()->map(function ($favorite) {
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
    }

    public function updateReadStatus(FavoriteBookStatusRequest $request)
    {
        $user = Auth::user();
        $favorite = FavoriteBook::where('user_id', $user->id)
            ->where('isbn', $request->isbn)
            ->first();

        if ($favorite) {
            $favorite->update(['read_status' => $request->readStatus]);
            return response()->json(['readStatus' => $request->readStatus]);
        }
    }

    public function toggleFavorite(FavoriteBookToggleRequest $request)
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
        if (!$existingBook) {
            $book = (new Book())->addBook($bookData);
        } else {
            $book = $existingBook;
        }

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
