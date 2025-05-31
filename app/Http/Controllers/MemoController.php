<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\BookController;
use App\Http\Requests\MemoStoreRequest;
use App\Http\Requests\MemoUpdateRequest;
use App\Services\MemoService;
use App\Http\Traits\HandlesUserAuth;
use Inertia\Inertia;

class MemoController extends Controller
{
    use HandlesUserAuth;
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

        return $this->createdResponse(['memo' => $memo]);
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
            return $this->errorResponse('Memo not found', 403);
        }
        
        return $this->successResponse(['memo' => $memo]);
    }

    public function destroy($memo_id)
    {
        $user = $this->getAuthUser();
        $deleted = $this->memoService->deleteMemo($memo_id, $user->id);

        if (!$deleted) {
            return $this->errorResponse('Memo not found', 403);
        }

        return $this->successResponse(['success' => true, 'message' => 'メモを削除しました']);
    }

    public function getBookMemos($isbn)
    {
        $currentUserId = $this->getAuthUser() ? $this->getAuthUser()->id : null;
        $memos = $this->memoService->getBookMemos($isbn, $currentUserId);

        return $this->successResponse(['memos' => $memos]);
    }
}
