<?php

namespace App\Http\Traits;

use Illuminate\Support\Facades\Auth;

trait HandlesUserAuth
{
    /**
     * 認証済みユーザーを取得する
     *
     * @return \App\Models\User
     */
    protected function getAuthUser()
    {
        return Auth::user();
    }
    
    /**
     * 認証済みユーザーのIDを取得する
     *
     * @return int
     */
    protected function getAuthUserId(): int
    {
        return Auth::id();
    }
    
    /**
     * ユーザーがリソースの所有者であることを確認する
     *
     * @param mixed $resource
     * @param string $userIdField
     * @return bool
     */
    protected function userOwnsResource($resource, string $userIdField = 'user_id'): bool
    {
        return $resource->{$userIdField} === $this->getAuthUserId();
    }
    
    /**
     * ユーザーがリソースの所有者でない場合、403エラーを返す
     *
     * @param mixed $resource
     * @param string $userIdField
     * @param string $message
     * @return void
     */
    protected function authorizeUserResource($resource, string $userIdField = 'user_id', string $message = 'アクセス権限がありません'): void
    {
        if (!$this->userOwnsResource($resource, $userIdField)) {
            abort(403, $message);
        }
    }
}