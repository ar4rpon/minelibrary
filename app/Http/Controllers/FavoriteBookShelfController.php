<?php

namespace App\Http\Controllers;

use App\Services\FavoriteBookShelfService;
use Illuminate\Http\Request;
use App\Http\Traits\HandlesUserAuth;
use App\Http\Traits\HandlesApiResponses;
use Inertia\Inertia;
use Inertia\Response;

class FavoriteBookShelfController extends Controller
{
    use HandlesUserAuth, HandlesApiResponses;

    private FavoriteBookShelfService $favoriteBookShelfService;

    public function __construct(FavoriteBookShelfService $favoriteBookShelfService)
    {
        $this->favoriteBookShelfService = $favoriteBookShelfService;
    }
    /**
     * お気に入り本棚一覧を表示
     *
     * @return Response
     */
    public function index(): Response
    {
        $user = $this->getAuthUser();
        $favoriteBookShelves = $this->favoriteBookShelfService->getFavoriteBookShelves($user->id);

        return Inertia::render('BookShelf/BookShelfList', [
            'favoriteBookShelves' => $favoriteBookShelves,
        ]);
    }

    /**
     * 本棚をお気に入りに追加/削除する
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function toggleFavorite(Request $request)
    {
        $request->validate([
            'book_shelf_id' => 'required|exists:book_shelves,id',
        ]);

        $bookShelfId = $request->input('book_shelf_id');
        $userId = $this->getAuthUserId();

        try {
            $result = $this->favoriteBookShelfService->toggleFavorite($bookShelfId, $userId);
            return $this->successResponse($result);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 403);
        }
    }

    /**
     * 本棚のお気に入り状態を取得
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFavoriteStatus(Request $request)
    {
        $request->validate([
            'book_shelf_id' => 'required|exists:book_shelves,id',
        ]);

        $bookShelfId = $request->input('book_shelf_id');
        $userId = $this->getAuthUserId();

        $isFavorited = $this->favoriteBookShelfService->getFavoriteStatus($bookShelfId, $userId);

        return $this->successResponse([
            'is_favorited' => $isFavorited,
        ]);
    }
}
