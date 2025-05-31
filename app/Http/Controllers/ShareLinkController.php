<?php

namespace App\Http\Controllers;

use App\Services\ShareLinkService;
use Illuminate\Http\Request;
use App\Http\Requests\ShareLinkRequest;
use App\Http\Traits\HandlesUserAuth;
use App\Http\Traits\HandlesApiResponses;
use Inertia\Inertia;

class ShareLinkController extends Controller
{
    use HandlesUserAuth, HandlesApiResponses;

    private ShareLinkService $shareLinkService;

    public function __construct(ShareLinkService $shareLinkService)
    {
        $this->shareLinkService = $shareLinkService;
    }
    /**
     * 本棚の共有リンクを生成する
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function generateShareLink(ShareLinkRequest $request)
    {
        try {
            $user = $this->getAuthUser();
            $result = $this->shareLinkService->generateShareLink($request->book_shelf_id, $user->id);

            return $this->successResponse($result);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
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
        $data = $this->shareLinkService->getSharedBookShelf($token);

        return Inertia::render('BookShelf/SharedBookShelfDetail', $data);
    }
}
