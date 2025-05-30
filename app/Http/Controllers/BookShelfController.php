<?php

namespace App\Http\Controllers;

use App\Services\BookShelfService;
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

    private BookShelfService $bookShelfService;

    public function __construct(BookShelfService $bookShelfService)
    {
        $this->bookShelfService = $bookShelfService;
    }
    public function index()
    {
        $user = $this->getAuthUser();
        $bookShelves = $this->bookShelfService->getUserBookShelves($user->id);

        return Inertia::render('features/bookshelf/pages/BookShelfList', [
            'initialBookShelves' => $bookShelves
        ]);
    }

    public function show($book_shelf_id)
    {
        $user = $this->getAuthUser();
        $bookShelf = $this->bookShelfService->getBookShelfDetail($book_shelf_id, $user->id);

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

        $bookShelf = $this->bookShelfService->createBookShelf([
            'user_id' => $user->id,
            'book_shelf_name' => $request->book_shelf_name,
            'description' => $request->description,
            'is_public' => true
        ]);
        return $bookShelf;
    }

    public function update(BookShelfUpdateRequest $request, $id)
    {
        $user = $this->getAuthUser();
        $this->bookShelfService->updateBookShelf($id, $user->id, [
            'book_shelf_name' => $request->book_shelf_name,
            'description' => $request->description,
            'is_public' => $request->is_public
        ]);
    }

    public function getMyAll()
    {
        $user = $this->getAuthUser();
        $bookshelves = $this->bookShelfService->getAllUserBookShelves($user->id);

        return $this->successResponse($bookshelves);
    }

    public function addBooks(BookShelfBookRequest $request)
    {
        $this->bookShelfService->addBooksToShelf($request->book_shelf_id, $request->isbns);

        return $this->successMessage('Books added successfully');
    }

    public function getBooks(BookShelfGetBooksRequest $request)
    {
        $user = $this->getAuthUser();
        $books = $this->bookShelfService->getBooksFromShelf($request->book_shelf_id);
        
        // お気に入り状態を事前に取得
        $favoriteStatuses = $this->loadFavoriteStatuses($books, $user->id);
        
        $books = $this->formatBooksWithFavoriteStatus($books, $favoriteStatuses);

        return $this->successResponse($books);
    }

    public function destroy($id)
    {
        $user = $this->getAuthUser();
        $this->bookShelfService->deleteBookShelf($id, $user->id);

        return $this->deletedResponse('Book shelf deleted successfully');
    }

    public function removeBook(BookShelfRemoveBookRequest $request)
    {
        $user = $this->getAuthUser();
        $this->bookShelfService->removeBookFromShelf($request->book_shelf_id, $user->id, $request->isbn);

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
        $data = $this->bookShelfService->getPublicUserBookShelves($userId);

        return Inertia::render('features/bookshelf/pages/UserBookShelfList', $data);
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
        $currentUserId = $this->getAuthUser() ? $this->getAuthUserId() : null;
        $data = $this->bookShelfService->getPublicUserBookShelf($userId, $bookShelfId, $currentUserId);

        return Inertia::render('features/bookshelf/pages/UserBookShelfDetail', $data);
    }
}
