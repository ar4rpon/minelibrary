<?php

namespace App\Services;

use App\Models\BookShelf;
use App\Models\ShareLink;
use Illuminate\Support\Collection;

class ShareLinkService
{
    /**
     * 本棚の共有リンクを生成
     *
     * @param int $bookShelfId
     * @param int $userId
     * @return array
     * @throws \Exception
     */
    public function generateShareLink(int $bookShelfId, int $userId): array
    {
        // 本棚の所有者確認
        $bookShelf = BookShelf::where('id', $bookShelfId)
            ->where('user_id', $userId)
            ->firstOrFail();

        $shareLink = new ShareLink();
        $url = $shareLink->generateShareLink($bookShelfId);

        return [
            'share_url' => $url,
            'expiry_date' => $shareLink->expiry_date->toIso8601String(),
        ];
    }

    /**
     * 共有リンクから本棚情報を取得
     *
     * @param string $token
     * @return array
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException
     */
    public function getSharedBookShelf(string $token): array
    {
        // N+1問題解決: ShareLinkと関連するbookShelfとuserを一括取得
        $shareLink = ShareLink::where('share_token', $token)
            ->with([
                'bookShelf' => function($query) {
                    $query->select('id', 'user_id', 'book_shelf_name', 'description', 'is_public');
                },
                'bookShelf.user' => function($query) {
                    $query->select('id', 'name');
                }
            ])
            ->firstOrFail();

        if (!$shareLink->isValid()) {
            abort(403, '共有リンクの有効期限が切れています');
        }

        $bookShelf = $shareLink->bookShelf;
        $userName = $bookShelf->user->name;

        $books = $this->formatBooksForSharing($bookShelf->books);

        $bookShelf->user_name = $userName;

        return [
            'bookShelf' => $bookShelf,
            'books' => $books,
            'isShared' => true,
            'expiryDate' => $shareLink->expiry_date->toIso8601String(),
        ];
    }

    /**
     * 共有用に本の情報をフォーマット
     *
     * @param Collection $books
     * @return Collection
     */
    private function formatBooksForSharing(Collection $books): Collection
    {
        return $books->map(function ($book) {
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
    }
}