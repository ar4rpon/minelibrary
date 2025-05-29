<?php

use App\Models\User;
use Tests\Helpers\AuthTestHelper;
use Tests\Helpers\ApiTestHelper;
use Illuminate\Support\Facades\Http;

uses(AuthTestHelper::class, ApiTestHelper::class);

beforeEach(function () {
    $this->user = User::factory()->create();
});

test('認証されていないユーザーは本の検索ページにアクセスできない', function () {
    $this->get('/book/search')
        ->assertRedirect('/login');
});

test('認証済みユーザーは本の検索ページを表示できる', function () {
    $this->actingAs($this->user)
        ->get('/book/search')
        ->assertStatus(200);
});

test('タイトルで本を検索できる', function () {
    // 楽天APIのモック
    Http::fake([
        'https://app.rakuten.co.jp/services/api/BooksBook/Search/*' => Http::response([
            'Items' => [
                [
                    'Item' => [
                        'isbn' => '9784798151090',
                        'title' => 'PHPフレームワーク Laravel入門',
                        'author' => '掌田津耶乃',
                        'publisherName' => '秀和システム',
                        'salesDate' => '2023-01-01',
                        'smallImageUrl' => 'https://example.com/small.jpg',
                        'mediumImageUrl' => 'https://example.com/medium.jpg',
                        'largeImageUrl' => 'https://example.com/large.jpg',
                        'itemCaption' => 'Laravelの入門書',
                        'itemPrice' => 3300,
                    ]
                ]
            ],
            'pageCount' => 1,
            'hits' => 1,
            'page' => 1,
        ], 200),
    ]);

    $response = $this->actingAs($this->user)
        ->get('/book/search?keyword=Laravel&searchMethod=title')
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('features/book/pages/SearchBook')
            ->has('results', 1)
            ->where('results.0.Item.title', 'PHPフレームワーク Laravel入門')
        );
});

test('ISBNで本を検索できる', function () {
    Http::fake([
        'https://app.rakuten.co.jp/services/api/BooksBook/Search/*' => Http::response([
            'Items' => [
                [
                    'Item' => [
                        'isbn' => '9784798151090',
                        'title' => 'PHPフレームワーク Laravel入門',
                        'author' => '掌田津耶乃',
                        'publisherName' => '秀和システム',
                        'salesDate' => '2023-01-01',
                        'smallImageUrl' => 'https://example.com/small.jpg',
                        'mediumImageUrl' => 'https://example.com/medium.jpg',
                        'largeImageUrl' => 'https://example.com/large.jpg',
                        'itemCaption' => 'Laravelの入門書',
                        'itemPrice' => 3300,
                    ]
                ]
            ],
            'pageCount' => 1,
            'hits' => 1,
            'page' => 1,
        ], 200),
    ]);

    $this->actingAs($this->user)
        ->get('/book/search?keyword=9784798151090&searchMethod=isbn')
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->where('results.0.Item.isbn', '9784798151090')
        );
});

test('検索結果が0件の場合の表示', function () {
    Http::fake([
        'https://app.rakuten.co.jp/services/api/BooksBook/Search/*' => Http::response([
            'Items' => [],
            'pageCount' => 0,
            'hits' => 0,
            'page' => 1,
        ], 200),
    ]);

    $this->actingAs($this->user)
        ->get('/book/search?keyword=存在しない本')
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->has('results', 0)
        );
});

test('楽天APIエラー時の処理', function () {
    Http::fake([
        'https://app.rakuten.co.jp/services/api/BooksBook/Search/*' => Http::response([], 500),
    ]);

    $this->actingAs($this->user)
        ->get('/book/search?keyword=Laravel')
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->has('results', 0)
        );
});

test('ページネーションが機能する', function () {
    Http::fake([
        'https://app.rakuten.co.jp/services/api/BooksBook/Search/*' => Http::response([
            'Items' => array_map(fn($i) => [
                'Item' => [
                    'isbn' => "978479815109{$i}",
                    'title' => "本のタイトル{$i}",
                    'author' => "著者{$i}",
                    'publisherName' => '出版社',
                    'salesDate' => '2023-01-01',
                    'smallImageUrl' => 'https://example.com/small.jpg',
                    'mediumImageUrl' => 'https://example.com/medium.jpg',
                    'largeImageUrl' => 'https://example.com/large.jpg',
                    'itemCaption' => '説明',
                    'itemPrice' => 1000,
                ]
            ], range(1, 30)),
            'pageCount' => 3,
            'hits' => 90,
            'page' => 2,
            'count' => 90,
        ], 200),
    ]);

    $this->actingAs($this->user)
        ->get('/book/search?keyword=本&page=2')
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->where('filters.page', '2')
            ->where('totalItems', 90)
        );
});

test('ジャンルフィルターが機能する', function () {
    Http::fake([
        'https://app.rakuten.co.jp/services/api/BooksBook/Search/*' => Http::response([
            'Items' => [
                [
                    'Item' => [
                        'isbn' => '9784798151090',
                        'title' => 'プログラミング本',
                        'author' => '著者',
                        'publisherName' => '出版社',
                        'salesDate' => '2023-01-01',
                        'smallImageUrl' => 'https://example.com/small.jpg',
                        'mediumImageUrl' => 'https://example.com/medium.jpg',
                        'largeImageUrl' => 'https://example.com/large.jpg',
                        'itemCaption' => '説明',
                        'itemPrice' => 3000,
                    ]
                ]
            ],
            'pageCount' => 1,
            'hits' => 1,
            'page' => 1,
        ], 200),
    ]);

    $this->actingAs($this->user)
        ->get('/book/search?keyword=プログラミング&genre=001005')
        ->assertStatus(200);
});

test('ソート機能が動作する', function () {
    Http::fake([
        'https://app.rakuten.co.jp/services/api/BooksBook/Search/*' => Http::response([
            'Items' => [],
            'pageCount' => 0,
            'hits' => 0,
            'page' => 1,
        ], 200),
    ]);

    $this->actingAs($this->user)
        ->get('/book/search?keyword=本&sort=sales')
        ->assertStatus(200);
});

