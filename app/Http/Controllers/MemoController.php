<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\BookController;
use App\Models\Memo;
use Illuminate\Support\Facades\Auth;
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
                'contents' => $group->pluck('memo')->toArray(),
                'book' => array_merge($group->first()->book->toArray(), [
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

        $book = $this->bookController->getOrStore($request);

        if (!$book) {
            return response()->json(['error' => 'Book not found or could not be created'], 404);
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
}
