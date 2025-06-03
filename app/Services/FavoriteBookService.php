<?php

namespace App\Services;

use App\Models\FavoriteBook;
use App\Models\Book;
use Illuminate\Support\Collection;

class FavoriteBookService
{
    /**
     * お気に入り本のデータを取得
     *
     * @param int $userId
     * @param string|null $sortBy
     * @return Collection
     */
    public function getFavoritesData(int $userId, ?string $sortBy = null): Collection
    {
        // N+1問題解決: 必要な本の情報のみを効率的に取得
        $query = FavoriteBook::where('user_id', $userId)
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

        $favoriteBooks = $query->get();

        $result = $favoriteBooks->map(function ($favorite) {
            if (!$favorite->book) {
                return null;
            }

            return [
                'isbn' => $favorite->isbn,
                'read_status' => $favorite->read_status->value, // enumの値を文字列として返す
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
        })->filter(); // nullを除去

        return $result;
    }

    /**
     * 読書ステータスを更新
     *
     * @param int $userId
     * @param string $isbn
     * @param string $readStatus
     * @return array|null
     */
    public function updateReadStatus(int $userId, string $isbn, string $readStatus): ?array
    {
        $favorite = FavoriteBook::where('user_id', $userId)
            ->where('isbn', $isbn)
            ->first();

        if ($favorite) {
            $favorite->update(['read_status' => $readStatus]);
            return ['readStatus' => $readStatus];
        }

        return null;
    }

    /**
     * お気に入りの切り替え
     *
     * @param array $bookData
     * @param int $userId
     * @return bool
     */
    public function toggleFavorite(array $bookData, int $userId): bool
    {
        // 本が存在しない場合は新規登録
        $existingBook = Book::find($bookData['isbn']);
        if (!$existingBook) {
            $book = Book::create($bookData);
        } else {
            $book = $existingBook;
        }

        $isFavorite = FavoriteBook::isFavorite($book->isbn, $userId);

        if ($isFavorite) {
            FavoriteBook::where('isbn', $book->isbn)
                ->where('user_id', $userId)
                ->delete();
            return false;
        } else {
            FavoriteBook::addFavorite($book->isbn, $userId);
            return true;
        }
    }

    /**
     * お気に入り状態を取得
     *
     * @param string $isbn
     * @param int $userId
     * @return bool
     */
    public function getFavoriteStatus(string $isbn, int $userId): bool
    {
        return FavoriteBook::isFavorite($isbn, $userId);
    }
}