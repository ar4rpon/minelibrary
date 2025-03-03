<?php

namespace App\Http\Controllers;

use App\Models\BookShelf;
use App\Models\ShareLink;
use App\Models\FavoriteBook;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ShareLinkController extends Controller
{
    /**
     * 本棚の共有リンクを生成する
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function generateShareLink(Request $request)
    {
        try {
            $request->validate([
                'book_shelf_id' => 'required|exists:book_shelves,id',
            ]);

            $user = Auth::user();
            $bookShelf = BookShelf::where('id', $request->book_shelf_id)
                ->where('user_id', $user->id)
                ->firstOrFail();

            $shareLink = new ShareLink();
            $url = $shareLink->generateShareLink($request->book_shelf_id);

            return response()->json([
                'share_url' => $url,
                'expiry_date' => $shareLink->expiry_date->toIso8601String(),
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'errors' => null
            ], 500);
        }
    }

    /**
     * 共有リンクを使用して本棚を表示する
     *
     * @param string $token
     * @return \Inertia\Response
     */
    public function showSharedBookShelf($token)
    {
        $shareLink = ShareLink::where('share_token', $token)->firstOrFail();

        if (!$shareLink->isValid()) {
            abort(403, '共有リンクの有効期限が切れています');
        }

        $bookShelf = $shareLink->bookShelf;
        $userName = $bookShelf->user->name;

        $books = BookShelf::getBooks($bookShelf->id)->map(function ($book) {
            return [
                'isbn' => $book->isbn,
                'read_status' => null,
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

        $bookShelf->user_name = $userName;

        return Inertia::render('features/bookshelf/pages/SharedBookShelfDetail', [
            'bookShelf' => $bookShelf,
            'books' => $books,
            'isShared' => true,
            'expiryDate' => $shareLink->expiry_date->toIso8601String(),
        ]);
    }
}
