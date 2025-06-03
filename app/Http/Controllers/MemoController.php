<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\BookController;
use App\Http\Requests\MemoStoreRequest;
use App\Http\Requests\MemoUpdateRequest;
use App\Services\MemoService;
use App\Http\Traits\HandlesUserAuth;
use App\Http\Traits\HandlesApiResponses;
use Inertia\Inertia;

class MemoController extends Controller
{
    use HandlesUserAuth, HandlesApiResponses;
    protected $bookController;
    private MemoService $memoService;

    public function __construct(BookController $bookController, MemoService $memoService)
    {
        $this->bookController = $bookController;
        $this->memoService = $memoService;
    }

    public function index(Request $request)
    {
        $user = $this->getAuthUser();
        $sortBy = $request->input('sortBy', 'date');
        $memos = $this->memoService->getUserMemos($user->id, $sortBy);

        return Inertia::render('Memo/MemoList', [
            'memos' => $memos,
            'sortBy' => $sortBy,
        ]);
    }

    public function store(MemoStoreRequest $request)
    {
        $user = $this->getAuthUser();
        $memo = $this->memoService->createMemo(
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
        $user = $this->getAuthUser();
        $memo = $this->memoService->updateMemo(
            $memo_id,
            $user->id,
            $request->memo,
            $request->memo_chapter,
            $request->memo_page
        );

        if (!$memo) {
            return response()->json(['error' => 'Memo not found'], 403);
        }
        
        return response()->json(['memo' => $memo], 200);
    }

    public function destroy($memo_id)
    {
        $user = $this->getAuthUser();
        $deleted = $this->memoService->deleteMemo($memo_id, $user->id);

        if (!$deleted) {
            return response()->json(['error' => 'Memo not found'], 403);
        }

        return response()->json(['success' => true, 'message' => 'メモを削除しました'], 200);
    }

    public function getBookMemos($isbn)
    {
        $currentUserId = $this->getAuthUser() ? $this->getAuthUser()->id : null;
        $memos = $this->memoService->getBookMemos($isbn, $currentUserId);

        return response()->json(['memos' => $memos], 200);
    }
}
