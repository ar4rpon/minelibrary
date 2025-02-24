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
                    'publisherName' => $group->first()->book->publisher_name,
                    'itemCaption' => $group->first()->book->item_caption,
                    'salesDate' => $group->first()->book->sales_date,
                    'itemPrice' => $group->first()->book->item_price,
                    'imageUrl' => $group->first()->book->image_url,
                ]),
            ];
        })->values();

        return Inertia::render('MemoList', [
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
                ];
            });

        return response()->json($memos);
    }
}
