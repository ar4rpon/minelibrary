<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\BookController;
use App\Models\Memo;
use Illuminate\Support\Facades\Auth;
// use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
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

        // N+1問題解決: eager loadingで必要な本の情報のみを選択取得
        $query = Memo::where('user_id', $user->id)
            ->with([
                'book' => function($query) {
                    $query->select('isbn', 'title', 'author', 'publisher_name', 'sales_date', 'image_url', 'item_caption', 'item_price');
                }
            ]);

        if ($sortBy === 'date') {
            $query->orderBy('created_at', 'desc');
        } elseif ($sortBy === 'title') {
            $query->join('books', 'memos.isbn', '=', 'books.isbn')
                ->orderBy('books.title')
                ->select('memos.*'); // joinの後に元のカラムを明示的に選択
        }

        $memos = $query->get()->groupBy('isbn')->map(function ($group) {
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

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'isbn' => 'required|string',
            'memo' => 'required|string',
            'memo_chapter' => 'nullable|integer',
            'memo_page' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }


        // メモの作成
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

    public function update(Request $request, $memo_id)
    {
        $user = Auth::user();
        $memo = Memo::where('id', $memo_id)->where('user_id', $user->id)->first();

        $validator = Validator::make($request->all(), [
            'memo' => 'required|string',
            'memo_chapter' => 'nullable|integer',
            'memo_page' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $memo->updateMemo(
            $request->memo,
            $request->memo_chapter,
            $request->memo_page
        );
    }

    public function destroy($memo_id)
    {
        $user = Auth::user();
        $memo = Memo::where('id', $memo_id)->where('user_id', $user->id)->first();

        if ($memo->delete()) {
            return response()->json(['message' => 'Memo deleted successfully'], 200);
        } else {
            return response()->json(['error' => 'Failed to delete memo'], 500);
        }
    }

    public function getBookMemos($isbn)
    {
        // N+1問題解決: user情報を必要な部分のみ取得
        $baseQuery = Memo::where('isbn', $isbn)
            ->join('users', 'memos.user_id', '=', 'users.id')
            ->where('users.is_memo_publish', true) // 公開設定のユーザーのみ
            ->select('memos.*', 'users.name as user_name')
            ->orderBy('created_at', 'desc');

        if (Auth::user()) {
            $user = Auth::user();
            
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
                        'user_name' => $memo->user_name,
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
                        'user_name' => $memo->user_name,
                        'is_current_user' => false,
                        'created_at' => $memo->created_at->format('Y-m-d'),
                    ];
                });
        }

        return response()->json(['memos' => $memos]);
    }
}
