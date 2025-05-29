<?php

namespace App\Http\Traits;

trait HandlesApiResponses
{
    /**
     * ページネーションデータを整形する
     *
     * @param \Illuminate\Pagination\LengthAwarePaginator $paginator
     * @return array
     */
    protected function formatPaginationData($paginator): array
    {
        return [
            'data' => $paginator->items(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'from' => $paginator->firstItem(),
                'last_page' => $paginator->lastPage(),
                'path' => $paginator->path(),
                'per_page' => $paginator->perPage(),
                'to' => $paginator->lastItem(),
                'total' => $paginator->total(),
            ],
            'links' => [
                'first' => $paginator->url(1),
                'last' => $paginator->url($paginator->lastPage()),
                'prev' => $paginator->previousPageUrl(),
                'next' => $paginator->nextPageUrl(),
            ],
        ];
    }
    
    /**
     * 成功時のメッセージレスポンスを返す
     *
     * @param string $message
     * @param array $data
     * @return \Illuminate\Http\JsonResponse
     */
    protected function successMessage(string $message, array $data = [])
    {
        $response = ['message' => $message];
        
        if (!empty($data)) {
            $response = array_merge($response, $data);
        }
        
        return response()->json($response, 200);
    }
    
    /**
     * 更新成功時のレスポンスを返す
     *
     * @param mixed $data
     * @param string $message
     * @return \Illuminate\Http\JsonResponse
     */
    protected function updatedResponse($data = null, string $message = '更新しました')
    {
        if ($data !== null) {
            return response()->json(['message' => $message, 'data' => $data], 200);
        }
        
        return response()->json(['message' => $message], 200);
    }
}