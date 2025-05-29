<?php

namespace Tests\Helpers;

use Illuminate\Testing\TestResponse;

trait ApiTestHelper
{
    /**
     * APIレスポンスの基本構造を検証
     *
     * @param TestResponse $response
     * @param int $expectedStatus
     * @param array $expectedStructure
     * @return TestResponse
     */
    protected function assertApiResponse(TestResponse $response, int $expectedStatus, array $expectedStructure = []): TestResponse
    {
        $response->assertStatus($expectedStatus);
        
        if (!empty($expectedStructure)) {
            $response->assertJsonStructure($expectedStructure);
        }
        
        return $response;
    }

    /**
     * ページネーションAPIレスポンスの検証
     *
     * @param TestResponse $response
     * @param string $dataKey
     * @return TestResponse
     */
    protected function assertPaginatedResponse(TestResponse $response, string $dataKey = 'data'): TestResponse
    {
        return $response
            ->assertStatus(200)
            ->assertJsonStructure([
                $dataKey,
                'links' => [
                    'first',
                    'last',
                    'prev',
                    'next',
                ],
                'meta' => [
                    'current_page',
                    'from',
                    'last_page',
                    'path',
                    'per_page',
                    'to',
                    'total',
                ],
            ]);
    }

    /**
     * バリデーションエラーレスポンスの検証
     *
     * @param TestResponse $response
     * @param array $expectedErrors
     * @return TestResponse
     */
    protected function assertValidationError(TestResponse $response, array $expectedErrors): TestResponse
    {
        $response->assertStatus(422)
            ->assertJsonValidationErrors($expectedErrors);
        
        return $response;
    }

    /**
     * 成功レスポンスの検証
     *
     * @param TestResponse $response
     * @param array $expectedData
     * @param int $status
     * @return TestResponse
     */
    protected function assertSuccessResponse(TestResponse $response, array $expectedData = [], int $status = 200): TestResponse
    {
        $response->assertStatus($status);
        
        if (!empty($expectedData)) {
            $response->assertJson($expectedData);
        }
        
        return $response;
    }

    /**
     * エラーレスポンスの検証
     *
     * @param TestResponse $response
     * @param string $expectedMessage
     * @param int $status
     * @return TestResponse
     */
    protected function assertErrorResponse(TestResponse $response, string $expectedMessage, int $status = 400): TestResponse
    {
        return $response
            ->assertStatus($status)
            ->assertJson([
                'message' => $expectedMessage,
            ]);
    }

    /**
     * リソース作成レスポンスの検証
     *
     * @param TestResponse $response
     * @param array $expectedData
     * @return TestResponse
     */
    protected function assertCreatedResponse(TestResponse $response, array $expectedData = []): TestResponse
    {
        return $this->assertSuccessResponse($response, $expectedData, 201);
    }

    /**
     * リソース削除レスポンスの検証
     *
     * @param TestResponse $response
     * @return TestResponse
     */
    protected function assertDeletedResponse(TestResponse $response): TestResponse
    {
        return $response->assertStatus(204);
    }

    /**
     * APIヘッダーを設定
     *
     * @param array $headers
     * @return array
     */
    protected function apiHeaders(array $headers = []): array
    {
        return array_merge([
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ], $headers);
    }

    /**
     * APIリクエストを実行
     *
     * @param string $method
     * @param string $uri
     * @param array $data
     * @param array $headers
     * @return TestResponse
     */
    protected function apiRequest(string $method, string $uri, array $data = [], array $headers = []): TestResponse
    {
        return $this->withHeaders($this->apiHeaders($headers))
            ->json($method, $uri, $data);
    }
}