<?php

namespace App\Http\Controllers;

use App\Models\BookShelf;
use App\Models\FavoriteBook;
use App\Models\FavoriteBookShelf;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use App\Http\Traits\HandlesUserAuth;
use App\Http\Traits\HandlesEagerLoading;
use App\Http\Traits\HandlesApiResponses;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Requests\BookShelfStoreRequest;
use App\Http\Requests\BookShelfUpdateRequest;
use App\Http\Requests\BookShelfBookRequest;
use App\Http\Requests\BookShelfGetBooksRequest;
use App\Http\Requests\BookShelfRemoveBookRequest;

class BookShelfController extends Controller
{
    use HandlesUserAuth, HandlesEagerLoading, HandlesApiResponses;
    public function index()
    {
        $user = $this->getAuthUser();

        // 自分の本棚を取得
        $myBookshelves = BookShelf::where('user_id', $user->id)
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
                    'type' => 'my' // 自分の本棚を識別するためのタイプ
                ];
            });

        // お気に入り本棚を取得 - N+1問題解決のため完全なeager loading実装
        $favoriteBookShelves = FavoriteBookShelf::where('user_id', $user->id)
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
                // 本棚が存在する場合のみ処理
                if ($bookShelf) {
                    return [
                        'bookShelfId' => $bookShelf->id,
                        'name' => $bookShelf->book_shelf_name,
                        'description' => $bookShelf->description,
                        'isPublic' => $bookShelf->is_public,
                        'type' => 'favorite', // お気に入り本棚を識別するためのタイプ
                        'owner' => [
                            'id' => $bookShelf->user->id,
                            'name' => $bookShelf->user->name,
                        ],
                    ];
                }
                return null;
            })
            ->filter() // nullの要素を除外
            ->values(); // インデックスを振り直し

        return Inertia::render('features/bookshelf/pages/BookShelfList', [
            'initialBookShelves' => [
                'my' => $myBookshelves,
                'favorite' => $favoriteBookShelves
            ]
        ]);
    }

    public function show($book_shelf_id)
    {
        $user = $this->getAuthUser();
        $bookShelf = BookShelf::where('id', $book_shelf_id)
            ->where('user_id', $user->id)
            ->with('user')
            ->firstOrFail();

        $userName = $bookShelf->user->name;

        $books = $bookShelf->books;
        
        // お気に入り状態を事前に取得
        $favoriteStatuses = $this->loadFavoriteStatuses($books, $user->id);
        
        $books = $this->formatBooksWithFavoriteStatus($books, $favoriteStatuses);

        $bookShelf->user_name = $userName;

        return Inertia::render('features/bookshelf/pages/BookShelfDetail', [
            'bookShelf' => $bookShelf,
            'books' => $books,
        ]);
    }

    public function store(BookShelfStoreRequest $request)
    {
        $user = $this->getAuthUser();

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

    public function update(BookShelfUpdateRequest $request, $id)
    {
        $user = $this->getAuthUser();
        $bookShelf = BookShelf::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();
            
        $bookShelf->updateName($request->book_shelf_name);
        $bookShelf->updateDescription($request->description);
        $bookShelf->updateIsPublic($request->is_public);
    }

    public function getMyAll()
    {
        $user = $this->getAuthUser();

        $bookshelves = BookShelf::where('user_id', $user->id)
            ->select(
                'id',
                'book_shelf_name',
                'description',
                'is_public'
            )
            ->get();

        return $this->successResponse($bookshelves);
    }

    public function addBooks(BookShelfBookRequest $request)
    {
        $bookShelf = BookShelf::findOrFail($request->book_shelf_id);

        // N+1問題解決: 一括挿入でパフォーマンス改善
        $bookShelf->addBooksInBatch($request->isbns);

        return $this->successMessage('Books added successfully');
    }

    public function getBooks(BookShelfGetBooksRequest $request)
    {

        $user = $this->getAuthUser();
        $bookShelf = BookShelf::findOrFail($request->book_shelf_id);
        $books = $bookShelf->books;
        
        // お気に入り状態を事前に取得
        $favoriteStatuses = $this->loadFavoriteStatuses($books, $user->id);
        
        $books = $this->formatBooksWithFavoriteStatus($books, $favoriteStatuses);

        return $this->successResponse($books);
    }

    public function destroy($id)
    {
        $user = $this->getAuthUser();
        $bookShelf = BookShelf::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $bookShelf->delete();

        return $this->deletedResponse('Book shelf deleted successfully');
    }

    public function removeBook(BookShelfRemoveBookRequest $request)
    {
        $user = $this->getAuthUser();
        $bookShelf = BookShelf::where('id', $request->book_shelf_id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $bookShelf->removeBook($request->isbn);

        return $this->successMessage('Book removed successfully');
    }

    /**
     * 指定したユーザーの公開本棚一覧を表示
     *
     * @param int $userId
     * @return \Inertia\Response
     */
    public function userBookShelves($userId)
    {
        // ユーザーの存在確認
        $user = User::findOrFail($userId);

        // 公開されている本棚のみ取得
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

        return Inertia::render('features/bookshelf/pages/UserBookShelfList', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
            ],
            'bookshelves' => $bookshelves
        ]);
    }

    /**
     * 指定したユーザーの特定の公開本棚を表示
     *
     * @param int $userId
     * @param int $bookShelfId
     * @return \Inertia\Response
     */
    public function userBookShelf($userId, $bookShelfId)
    {
        // ユーザーの存在確認
        $user = User::findOrFail($userId);

        // 公開されている本棚のみ取得
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
        if ($this->getAuthUser()) {
            $isFavorited = FavoriteBookShelf::where('book_shelf_id', $bookShelf->id)
                ->where('user_id', $this->getAuthUserId())
                ->exists();
        }

        return Inertia::render('features/bookshelf/pages/UserBookShelfDetail', [
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
        ]);
    }
}
