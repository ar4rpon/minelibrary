<?php

namespace Tests\Helpers;

use App\Models\User;
use Illuminate\Testing\TestResponse;

trait AuthTestHelper
{
    /**
     * 認証済みユーザーを作成し、そのユーザーとして行動する
     *
     * @param array $attributes
     * @return User
     */
    protected function actingAsUser(array $attributes = []): User
    {
        $user = User::factory()->create($attributes);
        $this->actingAs($user);
        return $user;
    }

    /**
     * 認証が必要なエンドポイントのテスト
     *
     * @param string $method
     * @param string $uri
     * @param array $data
     * @return TestResponse
     */
    protected function assertAuthRequired(string $method, string $uri, array $data = []): TestResponse
    {
        $response = $this->json($method, $uri, $data);
        $response->assertStatus(401);
        return $response;
    }

    /**
     * 認証済みユーザーでリクエストを実行
     *
     * @param string $method
     * @param string $uri
     * @param array $data
     * @param User|null $user
     * @return TestResponse
     */
    protected function authenticatedRequest(string $method, string $uri, array $data = [], ?User $user = null): TestResponse
    {
        if (!$user) {
            $user = User::factory()->create();
        }
        
        return $this->actingAs($user)->json($method, $uri, $data);
    }

    /**
     * 指定したユーザーがリソースにアクセスできないことを確認
     *
     * @param User $user
     * @param string $method
     * @param string $uri
     * @param int $expectedStatus
     * @return TestResponse
     */
    protected function assertUnauthorized(User $user, string $method, string $uri, int $expectedStatus = 403): TestResponse
    {
        $response = $this->actingAs($user)->json($method, $uri);
        $response->assertStatus($expectedStatus);
        return $response;
    }

    /**
     * ログインエンドポイントをテスト
     *
     * @param string $email
     * @param string $password
     * @return TestResponse
     */
    protected function attemptLogin(string $email, string $password): TestResponse
    {
        return $this->post('/login', [
            'email' => $email,
            'password' => $password,
        ]);
    }

    /**
     * ユーザーを作成してログイン
     *
     * @param array $attributes
     * @return User
     */
    protected function createAndLogin(array $attributes = []): User
    {
        $user = User::factory()->create(array_merge([
            'password' => bcrypt('password'),
        ], $attributes));
        
        $this->attemptLogin($user->email, 'password');
        
        return $user;
    }
}