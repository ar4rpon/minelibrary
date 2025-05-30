<?php

namespace App\Services;

use App\Models\User;
use App\Models\BookShelf;
use App\Models\FavoriteBook;
use App\Models\Memo;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;

class ProfileService
{
    /**
     * ユーザーのプロフィールデータを取得
     *
     * @param User $user
     * @param int|null $currentUserId
     * @return array
     */
    public function getProfileData(User $user, ?int $currentUserId = null): array
    {
        return [
            'user' => $this->getUserInfo($user),
            'recentMemos' => $this->getRecentMemos($user),
            'recentFavorites' => $this->getRecentFavorites($user),
            'bookShelves' => $this->getPublicBookShelves($user, $currentUserId),
        ];
    }

    /**
     * ユーザー基本情報を取得
     *
     * @param User $user
     * @return array
     */
    private function getUserInfo(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'profile_image' => $user->profile_image,
            'profile_message' => $user->profile_message,
        ];
    }

    /**
     * 直近5件のメモを取得
     *
     * @param User $user
     * @return Collection
     */
    private function getRecentMemos(User $user): Collection
    {
        return Memo::where('user_id', $user->id)
            ->with('book')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($memo) {
                return [
                    'id' => $memo->id,
                    'memo' => $memo->memo,
                    'memo_chapter' => $memo->memo_chapter,
                    'memo_page' => $memo->memo_page,
                    'created_at' => $memo->created_at->format('Y-m-d'),
                    'book' => [
                        'isbn' => $memo->book->isbn,
                        'title' => $memo->book->title,
                        'author' => $memo->book->author,
                        'image_url' => $memo->book->image_url,
                    ],
                ];
            });
    }

    /**
     * 直近5件のお気に入り書籍を取得
     *
     * @param User $user
     * @return Collection
     */
    private function getRecentFavorites(User $user): Collection
    {
        return FavoriteBook::where('user_id', $user->id)
            ->with('book')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($favorite) {
                return [
                    'isbn' => $favorite->isbn,
                    'read_status' => $favorite->read_status,
                    'created_at' => $favorite->created_at->format('Y-m-d'),
                    'book' => [
                        'title' => $favorite->book->title,
                        'author' => $favorite->book->author,
                        'image_url' => $favorite->book->image_url,
                    ],
                ];
            });
    }

    /**
     * 公開本棚を取得
     *
     * @param User $user
     * @param int|null $currentUserId
     * @return Collection
     */
    private function getPublicBookShelves(User $user, ?int $currentUserId = null): Collection
    {
        return BookShelf::where('user_id', $user->id)
            ->where('is_public', true)
            ->withCount('books')
            ->with(['favoritedBy' => function($query) use ($currentUserId) {
                if ($currentUserId) {
                    $query->where('user_id', $currentUserId);
                }
            }])
            ->select(
                'id',
                'book_shelf_name',
                'description',
                'is_public',
                'created_at',
                'user_id'
            )
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($bookShelf) use ($currentUserId) {
                // ログインユーザーがお気に入りに登録しているかチェック
                $isFavorited = false;
                if ($currentUserId) {
                    $isFavorited = $bookShelf->favoritedBy->isNotEmpty();
                }

                return [
                    'id' => $bookShelf->id,
                    'name' => $bookShelf->book_shelf_name,
                    'description' => $bookShelf->description,
                    'is_public' => $bookShelf->is_public,
                    'created_at' => $bookShelf->created_at->format('Y-m-d'),
                    'book_count' => $bookShelf->books_count,
                    'is_favorited' => $isFavorited,
                    'user_id' => $bookShelf->user_id,
                ];
            });
    }

    /**
     * 非公開本棚を取得（自分のプロフィール用）
     *
     * @param User $user
     * @return Collection
     */
    public function getPrivateBookShelves(User $user): Collection
    {
        return BookShelf::where('user_id', $user->id)
            ->where('is_public', false)
            ->withCount('books')
            ->select(
                'id',
                'book_shelf_name',
                'description',
                'is_public',
                'created_at'
            )
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($bookShelf) {
                return [
                    'id' => $bookShelf->id,
                    'name' => $bookShelf->book_shelf_name,
                    'description' => $bookShelf->description,
                    'is_public' => $bookShelf->is_public,
                    'created_at' => $bookShelf->created_at->format('Y-m-d'),
                    'book_count' => $bookShelf->books_count,
                ];
            });
    }

    /**
     * プロフィール情報を更新
     *
     * @param User $user
     * @param array $data
     * @return bool
     */
    public function updateProfile(User $user, array $data): bool
    {
        $user->fill($data);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        return $user->save();
    }

    /**
     * ユーザーアカウントを削除
     *
     * @param User $user
     * @return void
     */
    public function deleteAccount(User $user): void
    {
        Auth::logout();
        $user->delete();
    }
}