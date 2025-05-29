<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

abstract class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;
    
    /**
     * 成功時のJSONレスポンスを返す
     *
     * @param mixed $data
     * @param int $status
     * @return \Illuminate\Http\JsonResponse
     */
    protected function successResponse($data = null, int $status = 200)
    {
        return response()->json($data, $status);
    }
    
    /**
     * エラー時のJSONレスポンスを返す
     *
     * @param string $message
     * @param int $status
     * @param array|null $errors
     * @return \Illuminate\Http\JsonResponse
     */
    protected function errorResponse(string $message, int $status = 400, ?array $errors = null)
    {
        $response = ['message' => $message];
        
        if ($errors !== null) {
            $response['errors'] = $errors;
        }
        
        return response()->json($response, $status);
    }
    
    /**
     * 削除成功時のレスポンスを返す
     *
     * @param string $message
     * @return \Illuminate\Http\JsonResponse
     */
    protected function deletedResponse(string $message = '削除しました')
    {
        return $this->successResponse(['message' => $message], 200);
    }
    
    /**
     * 作成成功時のレスポンスを返す
     *
     * @param mixed $data
     * @return \Illuminate\Http\JsonResponse
     */
    protected function createdResponse($data)
    {
        return $this->successResponse($data, 201);
    }
}
