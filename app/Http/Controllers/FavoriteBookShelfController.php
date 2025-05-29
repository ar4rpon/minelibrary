<?php

namespace App\Http\Controllers;

use App\Models\BookShelf;
use App\Models\FavoriteBookShelf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class FavoriteBookShelfController extends Controller
{
    /**
     * お気に入り本棚一覧を表示
     *
     * @return Response
     */
    public function index(): Response
    {
        $user = Auth::user();

        // N+1問題解決: 必要な関連データを一括取得とwithCountを使用
        $favoriteBookShelves = FavoriteBookShelf::where('user_id', $user->id)
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

        return Inertia::render('features/bookshelf/pages/FavoriteList', [
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
        $user = Auth::user();
        $userId = $user->id;

        // 本棚が公開されているか確認
        $bookShelf = BookShelf::findOrFail($bookShelfId);
        if (!$bookShelf->is_public && $bookShelf->user_id !== $userId) {
            return response()->json([
                'message' => 'この本棚はお気に入りに追加できません。',
            ], 403);
        }

        // 既にお気に入りに追加されているか確認
        $favorite = FavoriteBookShelf::where('book_shelf_id', $bookShelfId)
            ->where('user_id', $userId)
            ->first();

        if ($favorite) {
            // お気に入りから削除
            $favorite->delete();
            $isFavorited = false;
            $message = 'お気に入りから削除しました。';
        } else {
            // お気に入りに追加
            FavoriteBookShelf::create([
                'book_shelf_id' => $bookShelfId,
                'user_id' => $userId,
            ]);
            $isFavorited = true;
            $message = 'お気に入りに追加しました。';
        }

        return response()->json([
            'is_favorited' => $isFavorited,
            'message' => $message,
        ]);
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
        $user = Auth::user();
        $userId = $user->id;

        $isFavorited = FavoriteBookShelf::where('book_shelf_id', $bookShelfId)
            ->where('user_id', $userId)
            ->exists();

        return response()->json([
            'is_favorited' => $isFavorited,
        ]);
    }
}
