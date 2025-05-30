<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\FavoriteBookToggleRequest;
use App\Http\Requests\FavoriteBookStatusRequest;
use App\Services\FavoriteBookService;
use App\Http\Traits\HandlesUserAuth;
use App\Http\Traits\HandlesEagerLoading;
use Inertia\Inertia;

class FavoriteBookController extends Controller
{
    use HandlesUserAuth, HandlesEagerLoading;

    private FavoriteBookService $favoriteBookService;

    public function __construct(FavoriteBookService $favoriteBookService)
    {
        $this->favoriteBookService = $favoriteBookService;
    }

    public function index(Request $request)
    {
        $user = $this->getAuthUser();
        $sortBy = $request->input('sortBy', 'newDate');
        $favorites = $this->favoriteBookService->getFavoritesData($user->id, $sortBy);

        return Inertia::render('features/book/pages/FavoriteBookList', [
            'favorites' => $favorites,
            'sortBy' => $sortBy,
        ]);
    }

    public function getFavorites()
    {
        $user = $this->getAuthUser();
        $favorites = $this->favoriteBookService->getFavoritesData($user->id);
        return $this->successResponse($favorites);
    }

    public function updateReadStatus(FavoriteBookStatusRequest $request)
    {
        $user = $this->getAuthUser();
        $result = $this->favoriteBookService->updateReadStatus($user->id, $request->isbn, $request->readStatus);

        if ($result) {
            return $this->successResponse($result);
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

        $user = $this->getAuthUser();
        $isFavorite = $this->favoriteBookService->toggleFavorite($bookData, $user->id);

        return $this->successResponse(['isFavorite' => $isFavorite]);
    }

    public function getFavoriteStatus(Request $request)
    {
        $user = $this->getAuthUser();
        $isFavorite = $this->favoriteBookService->getFavoriteStatus($request->isbn, $user->id);

        return $this->successResponse(['isFavorite' => $isFavorite]);
    }
}
