<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\BookController;
use App\Http\Requests\MemoStoreRequest;
use App\Http\Requests\MemoUpdateRequest;
use App\Models\Memo;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MemoController extends Controller
{
    protected $bookController;

    public function __construct(BookController $bookController)
    {
        $this->bookController = $bookController;
    }

    public function index(Request $request)
    {
        $user = Auth::user();
        $sortBy = $request->input('sortBy', 'date');

        $query = Memo::where('user_id', $user->id)->with('book');

        if ($sortBy === 'date') {
            $query->orderBy('created_at', 'desc');
        } elseif ($sortBy === 'title') {
            $query->join('books', 'memos.isbn', '=', 'books.isbn')
                ->orderBy('books.title');
        }

        $memos = $query->get()->groupBy('isbn')->map(function ($group) {
            return [
                'id' => $group->first()->isbn,
                'contents' => $group->map(function ($memo) {
                    return [
                        'id' => $memo->id,
                        'memo' => $memo->memo,
                        'memo_chapter' => $memo->memo_chapter,
                        'memo_page' => $memo->memo_page,
                    ];
                })->toArray(),
                'book' => array_merge($group->first()->book->toArray(), [
                    'isbn' => $group->first()->book->isbn,
                    'publisher_name' => $group->first()->book->publisher_name,
                    'item_caption' => $group->first()->book->item_caption,
                    'sales_date' => $group->first()->book->sales_date,
                    'item_price' => $group->first()->book->item_price,
                    'image_url' => $group->first()->book->image_url,
                ]),
            ];
        })->values();

        return Inertia::render('features/memo/pages/MemoList', [
            'memos' => $memos,
            'sortBy' => $sortBy,
        ]);
    }

    public function store(MemoStoreRequest $request)
    {
        $user = Auth::user();
        $memo = Memo::createMemo(
            $request->isbn,
            $request->memo,
            $user->id,
            $request->memo_chapter,
            $request->memo_page
        );

        return response()->json(['memo' => $memo], 201);
    }

    public function update(MemoUpdateRequest $request, $memo_id)
    {
        $user = Auth::user();
        $memo = Memo::where('id', $memo_id)->where('user_id', $user->id)->first();

        if (!$memo) {
            return response()->json(['error' => 'Memo not found'], 403);
        }

        $memo->updateMemo(
            $request->memo,
            $request->memo_chapter,
            $request->memo_page
        );
        
        return response()->json(['memo' => $memo], 200);
    }

    public function destroy($memo_id)
    {
        $user = Auth::user();
        $memo = Memo::where('id', $memo_id)->where('user_id', $user->id)->first();

        if (!$memo) {
            return response()->json(['error' => 'Memo not found'], 403);
        }

        if ($memo->delete()) {
            return response()->json(['success' => true, 'message' => 'メモを削除しました'], 200);
        } else {
            return response()->json(['error' => 'Failed to delete memo'], 500);
        }
    }

    public function getBookMemos($isbn)
    {
        if (Auth::user()) {
            $user = Auth::user();

            $memos = Memo::where('isbn', $isbn)
                ->with('user')
                // 登録ユーザーのメモを判別させる
                ->orderByRaw("CASE WHEN user_id = ? THEN 0 ELSE 1 END", [$user->id])
                ->orderBy('created_at', 'desc')
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
                        'user' => $memo->user,
                    ];
                });
        } else {
            $memos = Memo::where('isbn', $isbn)
                ->with('user')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($memo) {
                    return [
                        'id' => $memo->id,
                        'memo' => $memo->memo,
                        'memo_chapter' => $memo->memo_chapter,
                        'memo_page' => $memo->memo_page,
                        'user_name' => $memo->user->name,
                        'is_current_user' => "",
                        'created_at' => $memo->created_at->format('Y-m-d'),
                        'user' => $memo->user,
                    ];
                });
        }


        // 公開メモのみフィルタリング
        $publicMemos = $memos->filter(function ($memo) {
            return $memo['user']->is_memo_publish ?? false;
        })->values();

        return response()->json(['memos' => $publicMemos]);
    }
}
