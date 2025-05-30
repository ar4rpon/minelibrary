<?php

namespace App\Services;

use App\Models\Memo;
use Illuminate\Support\Collection;

class MemoService
{
    /**
     * ユーザーのメモ一覧を取得
     *
     * @param int $userId
     * @param string $sortBy
     * @return Collection
     */
    public function getUserMemos(int $userId, string $sortBy = 'date'): Collection
    {
        // N+1問題解決: eager loadingで必要な本の情報のみを選択取得
        $query = Memo::where('user_id', $userId)
            ->with([
                'book' => function($query) {
                    $query->select('isbn', 'title', 'author', 'publisher_name', 'sales_date', 'image_url', 'item_caption', 'item_price');
                }
            ]);

        if ($sortBy === 'date') {
            $query->orderBy('created_at', 'desc');
        }

        $memos = $query->get()->groupBy('isbn');
        
        // タイトルでソートする場合
        if ($sortBy === 'title') {
            $memos = $memos->sortBy(function ($group) {
                return $group->first()->book->title;
            });
        }
        
        return $memos->map(function ($group) {
            $firstMemo = $group->first();
            $book = $firstMemo->book;
            
            return [
                'id' => $firstMemo->isbn,
                'contents' => $group->map(function ($memo) {
                    return [
                        'id' => $memo->id,
                        'memo' => $memo->memo,
                        'memo_chapter' => $memo->memo_chapter,
                        'memo_page' => $memo->memo_page,
                    ];
                })->toArray(),
                'book' => [
                    'isbn' => $book->isbn,
                    'title' => $book->title,
                    'author' => $book->author,
                    'publisher_name' => $book->publisher_name,
                    'sales_date' => $book->sales_date,
                    'image_url' => $book->image_url,
                    'item_caption' => $book->item_caption,
                    'item_price' => $book->item_price,
                ],
            ];
        })->values();
    }

    /**
     * メモを作成
     *
     * @param string $isbn
     * @param string $memoText
     * @param int $userId
     * @param string|null $memoChapter
     * @param string|null $memoPage
     * @return Memo
     */
    public function createMemo(string $isbn, string $memoText, int $userId, ?string $memoChapter = null, ?string $memoPage = null): Memo
    {
        return Memo::createMemo($isbn, $memoText, $userId, $memoChapter, $memoPage);
    }

    /**
     * メモを更新
     *
     * @param int $memoId
     * @param int $userId
     * @param string $memoText
     * @param string|null $memoChapter
     * @param string|null $memoPage
     * @return Memo|null
     */
    public function updateMemo(int $memoId, int $userId, string $memoText, ?string $memoChapter = null, ?string $memoPage = null): ?Memo
    {
        $memo = Memo::where('id', $memoId)
            ->where('user_id', $userId)
            ->first();

        if (!$memo) {
            return null;
        }

        $memo->updateMemo($memoText, $memoChapter, $memoPage);
        return $memo;
    }

    /**
     * メモを削除
     *
     * @param int $memoId
     * @param int $userId
     * @return bool
     */
    public function deleteMemo(int $memoId, int $userId): bool
    {
        $memo = Memo::where('id', $memoId)
            ->where('user_id', $userId)
            ->first();

        if (!$memo) {
            return false;
        }

        $memo->delete();
        return true;
    }

    /**
     * 本に関連する公開メモを取得
     *
     * @param string $isbn
     * @param int|null $currentUserId
     * @return Collection
     */
    public function getBookMemos(string $isbn, ?int $currentUserId = null): Collection
    {
        // N+1問題解決: eager loadingでuser情報を取得
        $baseQuery = Memo::where('isbn', $isbn)
            ->with([
                'user' => function($query) {
                    $query->select('id', 'name', 'is_memo_publish')
                          ->where('is_memo_publish', true);
                }
            ])
            ->whereHas('user', function($query) {
                $query->where('is_memo_publish', true);
            })
            ->orderBy('created_at', 'desc');

        if ($currentUserId) {
            $memos = $baseQuery
                // 登録ユーザーのメモを判別させる
                ->orderByRaw("CASE WHEN memos.user_id = ? THEN 0 ELSE 1 END", [$currentUserId])
                ->get()
                ->map(function ($memo) use ($currentUserId) {
                    return [
                        'id' => $memo->id,
                        'memo' => $memo->memo,
                        'memo_chapter' => $memo->memo_chapter,
                        'memo_page' => $memo->memo_page,
                        'user_name' => $memo->user->name,
                        'is_current_user' => $memo->user_id === $currentUserId,
                        'created_at' => $memo->created_at->format('Y-m-d'),
                    ];
                });
        } else {
            $memos = $baseQuery
                ->get()
                ->map(function ($memo) {
                    return [
                        'id' => $memo->id,
                        'memo' => $memo->memo,
                        'memo_chapter' => $memo->memo_chapter,
                        'memo_page' => $memo->memo_page,
                        'user_name' => $memo->user->name,
                        'is_current_user' => false,
                        'created_at' => $memo->created_at->format('Y-m-d'),
                    ];
                });
        }

        return $memos;
    }
}