<?php

namespace App\Services;

use App\Models\BookShelf;
use App\Models\FavoriteBookShelf;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class BookShelfService
{
    /**
     * ユーザーの本棚一覧を取得（自分の本棚 + お気に入り本棚）
     */
    public function getUserBookShelves(int $userId): array
    {
        return [
            'my' => $this->getMyBookShelves($userId),
            'favorite' => $this->getFavoriteBookShelves($userId),
        ];
    }

    /**
     * 自分の本棚一覧を取得
     */
    private function getMyBookShelves(int $userId): Collection
    {
        return BookShelf::where('user_id', $userId)
            ->select(
                'id as bookShelfId',
                'book_shelf_name as name',
                'description',
                'is_public as isPublic'
            )
            ->get()
            ->map(function ($bookshelf) {
                return [
                    'bookShelfId' => $bookshelf->bookShelfId,
                    'name' => $bookshelf->name,
                    'description' => $bookshelf->description,
                    'isPublic' => $bookshelf->isPublic,
                    'type' => 'my'
                ];
            });
    }

    /**
     * お気に入り本棚一覧を取得
     */
    private function getFavoriteBookShelves(int $userId): Collection
    {
        return FavoriteBookShelf::where('user_id', $userId)
            ->with([
                'bookshelf' => function($query) {
                    $query->select('id', 'user_id', 'book_shelf_name', 'description', 'is_public');
                },
                'bookshelf.user' => function($query) {
                    $query->select('id', 'name');
                }
            ])
            ->get()
            ->map(function ($favorite) {
                $bookShelf = $favorite->bookshelf;
                if ($bookShelf) {
                    return [
                        'bookShelfId' => $bookShelf->id,
                        'name' => $bookShelf->book_shelf_name,
                        'description' => $bookShelf->description,
                        'isPublic' => $bookShelf->is_public,
                        'type' => 'favorite',
                        'owner' => [
                            'id' => $bookShelf->user->id,
                            'name' => $bookShelf->user->name,
                        ],
                    ];
                }
                return null;
            })
            ->filter()
            ->values();
    }

    /**
     * 本棚詳細を取得
     */
    public function getBookShelfDetail(int $bookShelfId, int $userId): BookShelf
    {
        return BookShelf::where('id', $bookShelfId)
            ->where('user_id', $userId)
            ->with('user')
            ->firstOrFail();
    }

    /**
     * 本棚を作成
     */
    public function createBookShelf(array $data): BookShelf
    {
        return BookShelf::add($data);
    }

    /**
     * 本棚を更新
     */
    public function updateBookShelf(int $bookShelfId, int $userId, array $data): void
    {
        $bookShelf = BookShelf::where('id', $bookShelfId)
            ->where('user_id', $userId)
            ->firstOrFail();
            
        if (isset($data['book_shelf_name'])) {
            $bookShelf->updateName($data['book_shelf_name']);
        }
        if (isset($data['description'])) {
            $bookShelf->updateDescription($data['description']);
        }
        if (isset($data['is_public'])) {
            $bookShelf->updateIsPublic($data['is_public']);
        }
    }

    /**
     * ユーザーの全本棚を取得
     */
    public function getAllUserBookShelves(int $userId): Collection
    {
        return BookShelf::where('user_id', $userId)
            ->select(
                'id',
                'book_shelf_name',
                'description',
                'is_public'
            )
            ->get();
    }

    /**
     * 本棚に本を追加
     */
    public function addBooksToShelf(int $bookShelfId, array $isbns): void
    {
        $bookShelf = BookShelf::findOrFail($bookShelfId);
        $bookShelf->addBooksInBatch($isbns);
    }

    /**
     * 本棚から本を取得
     */
    public function getBooksFromShelf(int $bookShelfId): Collection
    {
        $bookShelf = BookShelf::findOrFail($bookShelfId);
        return $bookShelf->books;
    }

    /**
     * 本棚を削除
     */
    public function deleteBookShelf(int $bookShelfId, int $userId): void
    {
        $bookShelf = BookShelf::where('id', $bookShelfId)
            ->where('user_id', $userId)
            ->firstOrFail();

        $bookShelf->delete();
    }

    /**
     * 本棚から本を削除
     */
    public function removeBookFromShelf(int $bookShelfId, int $userId, string $isbn): void
    {
        $bookShelf = BookShelf::where('id', $bookShelfId)
            ->where('user_id', $userId)
            ->firstOrFail();

        $bookShelf->removeBook($isbn);
    }

    /**
     * 指定ユーザーの公開本棚一覧を取得
     */
    public function getPublicUserBookShelves(int $userId): array
    {
        $user = User::findOrFail($userId);

        $bookshelves = BookShelf::where('user_id', $userId)
            ->where('is_public', true)
            ->withCount('books')
            ->select(
                'id as bookShelfId',
                'book_shelf_name as name',
                'description',
                'is_public as isPublic'
            )
            ->get()
            ->map(function ($bookshelf) {
                return [
                    'bookShelfId' => $bookshelf->bookShelfId,
                    'name' => $bookshelf->name,
                    'description' => $bookshelf->description,
                    'isPublic' => $bookshelf->isPublic,
                    'bookCount' => $bookshelf->books_count,
                ];
            });

        return [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
            ],
            'bookshelves' => $bookshelves
        ];
    }

    /**
     * 指定ユーザーの特定の公開本棚詳細を取得
     */
    public function getPublicUserBookShelf(int $userId, int $bookShelfId, ?int $currentUserId = null): array
    {
        $user = User::findOrFail($userId);

        $bookShelf = BookShelf::where('id', $bookShelfId)
            ->where('user_id', $userId)
            ->where('is_public', true)
            ->firstOrFail();

        $books = $bookShelf->books->map(function ($book) {
            return [
                'isbn' => $book->isbn,
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

        // 現在のユーザーがこの本棚をお気に入りに登録しているか確認
        $isFavorited = false;
        if ($currentUserId) {
            $isFavorited = FavoriteBookShelf::where('book_shelf_id', $bookShelf->id)
                ->where('user_id', $currentUserId)
                ->exists();
        }

        return [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
            ],
            'bookShelf' => [
                'id' => $bookShelf->id,
                'name' => $bookShelf->book_shelf_name,
                'description' => $bookShelf->description,
                'isPublic' => $bookShelf->is_public,
                'isFavorited' => $isFavorited,
            ],
            'books' => $books,
        ];
    }
}