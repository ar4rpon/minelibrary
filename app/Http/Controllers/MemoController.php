<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\BookController;
use App\Http\Requests\MemoStoreRequest;
use App\Http\Requests\MemoUpdateRequest;
use App\Models\Memo;
use App\Http\Traits\HandlesUserAuth;
use Inertia\Inertia;

class MemoController extends Controller
{
    use HandlesUserAuth;
    protected $bookController;

    public function __construct(BookController $bookController)
    {
        $this->bookController = $bookController;
    }

    public function index(Request $request)
    {
        $user = $this->getAuthUser();
        $sortBy = $request->input('sortBy', 'date');

        // N+1問題解決: eager loadingで必要な本の情報のみを選択取得
        $query = Memo::where('user_id', $user->id)
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
        
        $memos = $memos->map(function ($group) {
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

        return Inertia::render('features/memo/pages/MemoList', [
            'memos' => $memos,
            'sortBy' => $sortBy,
        ]);
    }

    public function store(MemoStoreRequest $request)
    {
        $user = $this->getAuthUser();
        $memo = Memo::createMemo(
            $request->isbn,
            $request->memo,
            $user->id,
            $request->memo_chapter,
            $request->memo_page
        );

        return $this->createdResponse(['memo' => $memo]);
    }

    public function update(MemoUpdateRequest $request, $memo_id)
    {
        $user = $this->getAuthUser();
        $memo = Memo::where('id', $memo_id)
            ->where('user_id', $user->id)
            ->first();

        if (!$memo) {
            return $this->errorResponse('Memo not found', 403);
        }

        $memo->updateMemo(
            $request->memo,
            $request->memo_chapter,
            $request->memo_page
        );
        
        return $this->successResponse(['memo' => $memo]);
    }

    public function destroy($memo_id)
    {
        $user = $this->getAuthUser();
        $memo = Memo::where('id', $memo_id)
            ->where('user_id', $user->id)
            ->first();

        if (!$memo) {
            return $this->errorResponse('Memo not found', 403);
        }

        $memo->delete();
        return $this->successResponse(['success' => true, 'message' => 'メモを削除しました']);
    }

    public function getBookMemos($isbn)
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

        if ($this->getAuthUser()) {
            $user = $this->getAuthUser();
            
            $memos = $baseQuery
                // 登録ユーザーのメモを判別させる
                ->orderByRaw("CASE WHEN memos.user_id = ? THEN 0 ELSE 1 END", [$user->id])
                ->get()
                ->map(function ($memo) use ($user) {
                    return [
                        'id' => $memo->id,
                        'memo' => $memo->memo,
                        'memo_chapter' => $memo->memo_chapter,
                        'memo_page' => $memo->memo_page,
                        'user_name' => $memo->user->name,
                        'is_current_user' => $memo->user_id === $user->id,
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

        return $this->successResponse(['memos' => $memos]);
    }
}
