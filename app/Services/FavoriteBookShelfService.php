<?php

namespace App\Services;

use App\Models\BookShelf;
use App\Models\FavoriteBookShelf;
use Illuminate\Support\Collection;

class FavoriteBookShelfService
{
    /**
     * ユーザーのお気に入り本棚一覧を取得
     *
     * @param int $userId
     * @return Collection
     */
    public function getFavoriteBookShelves(int $userId): Collection
    {
        // N+1問題解決: 必要な関連データを一括取得とwithCountを使用
        return FavoriteBookShelf::where('user_id', $userId)
            ->with([
                'bookshelf' => function($query) {
                    $query->select('id', 'user_id', 'book_shelf_name', 'description', 'is_public', 'created_at')
                          ->withCount('books');
                },
                'bookshelf.user' => function($query) {
                    $query->select('id', 'name');
                }
            ])
            ->get()
            ->map(function ($favorite) {
                $bookShelf = $favorite->bookshelf;

                return [
                    'id' => $bookShelf->id,
                    'name' => $bookShelf->book_shelf_name,
                    'description' => $bookShelf->description,
                    'is_public' => $bookShelf->is_public,
                    'created_at' => $bookShelf->created_at->format('Y-m-d'),
                    'book_count' => $bookShelf->books_count, // withCountで取得済み
                    'owner' => [
                        'id' => $bookShelf->user->id,
                        'name' => $bookShelf->user->name,
                    ],
                ];
            });
    }

    /**
     * 本棚のお気に入りを切り替え
     *
     * @param int $bookShelfId
     * @param int $userId
     * @return array
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function toggleFavorite(int $bookShelfId, int $userId): array
    {
        // 本棚が公開されているか確認
        $bookShelf = BookShelf::findOrFail($bookShelfId);
        if (!$bookShelf->is_public && $bookShelf->user_id !== $userId) {
            throw new \Exception('この本棚はお気に入りに追加できません。');
        }

        // 既にお気に入りに追加されているか確認
        $favorite = FavoriteBookShelf::where('book_shelf_id', $bookShelfId)
            ->where('user_id', $userId)
            ->first();

        if ($favorite) {
            // お気に入りから削除
            $favorite->delete();
            return [
                'is_favorited' => false,
                'message' => 'お気に入りから削除しました。',
            ];
        } else {
            // お気に入りに追加
            FavoriteBookShelf::create([
                'book_shelf_id' => $bookShelfId,
                'user_id' => $userId,
            ]);
            return [
                'is_favorited' => true,
                'message' => 'お気に入りに追加しました。',
            ];
        }
    }

    /**
     * 本棚のお気に入り状態を取得
     *
     * @param int $bookShelfId
     * @param int $userId
     * @return bool
     */
    public function getFavoriteStatus(int $bookShelfId, int $userId): bool
    {
        return FavoriteBookShelf::where('book_shelf_id', $bookShelfId)
            ->where('user_id', $userId)
            ->exists();
    }
}