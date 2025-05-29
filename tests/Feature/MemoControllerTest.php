<?php

use App\Models\User;
use App\Models\Book;
use App\Models\Memo;
use Tests\Helpers\AuthTestHelper;
use Tests\Helpers\DatabaseTestHelper;
use Tests\Helpers\ApiTestHelper;

uses(AuthTestHelper::class, DatabaseTestHelper::class, ApiTestHelper::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->book = Book::factory()->create();
});

test('認証されていないユーザーはメモ一覧にアクセスできない', function () {
    $this->get('/memo/list')
        ->assertRedirect('/login');
});

test('認証済みユーザーはメモ一覧を表示できる', function () {
    $this->actingAs($this->user)
        ->get('/memo/list')
        ->assertStatus(200);
});

test('メモを作成できる', function () {
    $memoData = [
        'isbn' => $this->book->isbn,
        'memo' => 'これは素晴らしい本です。特に第3章が印象的でした。',
        'memo_chapter' => 3,
        'memo_page' => 42,
    ];

    $this->actingAs($this->user)
        ->postJson('/memo/create', $memoData)
        ->assertStatus(201)
        ->assertJson([
            'memo' => [
                'isbn' => $this->book->isbn,
                'memo' => 'これは素晴らしい本です。特に第3章が印象的でした。',
                'memo_chapter' => 3,
                'memo_page' => 42,
            ]
        ]);

    $this->assertDatabaseHas('memos', [
        'user_id' => $this->user->id,
        'isbn' => $this->book->isbn,
        'memo' => 'これは素晴らしい本です。特に第3章が印象的でした。',
        'memo_chapter' => 3,
        'memo_page' => 42,
    ]);
});

test('章とページ情報なしでメモを作成できる', function () {
    $memoData = [
        'isbn' => $this->book->isbn,
        'memo' => '全体的な感想です。',
    ];

    $this->actingAs($this->user)
        ->postJson('/memo/create', $memoData)
        ->assertStatus(201);

    $this->assertDatabaseHas('memos', [
        'user_id' => $this->user->id,
        'isbn' => $this->book->isbn,
        'memo' => '全体的な感想です。',
        'memo_chapter' => null,
        'memo_page' => null,
    ]);
});

test('自分のメモを更新できる', function () {
    $memo = Memo::factory()
        ->forUser($this->user)
        ->forBook($this->book)
        ->create([
            'memo' => '古いメモ',
        ]);

    $updateData = [
        'memo' => '新しいメモ内容',
        'memo_chapter' => 5,
        'memo_page' => 100,
    ];

    $this->actingAs($this->user)
        ->putJson("/memo/{$memo->id}", $updateData)
        ->assertStatus(200)
        ->assertJson([
            'memo' => [
                'id' => $memo->id,
                'memo' => '新しいメモ内容',
            ]
        ]);

    $this->assertDatabaseHas('memos', [
        'id' => $memo->id,
        'memo' => '新しいメモ内容',
        'memo_chapter' => 5,
        'memo_page' => 100,
    ]);
});

test('他人のメモは更新できない', function () {
    $otherUser = User::factory()->create();
    $memo = Memo::factory()
        ->forUser($otherUser)
        ->forBook($this->book)
        ->create();

    $this->actingAs($this->user)
        ->putJson("/memo/{$memo->id}", [
            'memo' => '不正な更新',
        ])
        ->assertStatus(403);
});

test('自分のメモを削除できる', function () {
    $memo = Memo::factory()
        ->forUser($this->user)
        ->forBook($this->book)
        ->create();

    $this->actingAs($this->user)
        ->deleteJson("/memo/{$memo->id}")
        ->assertStatus(200)
        ->assertJson([
            'success' => true,
            'message' => 'メモを削除しました',
        ]);

    $this->assertDatabaseMissing('memos', [
        'id' => $memo->id,
    ]);
});

test('他人のメモは削除できない', function () {
    $otherUser = User::factory()->create();
    $memo = Memo::factory()
        ->forUser($otherUser)
        ->forBook($this->book)
        ->create();

    $this->actingAs($this->user)
        ->deleteJson("/memo/{$memo->id}")
        ->assertStatus(403);

    $this->assertDatabaseHas('memos', [
        'id' => $memo->id,
    ]);
});

test('本のメモ一覧を取得できる（公開メモ）', function () {
    $publicUser = User::factory()->create([
        'is_memo_publish' => true,
    ]);
    $privateUser = User::factory()->create([
        'is_memo_publish' => false,
    ]);

    // 公開ユーザーのメモ
    $publicMemo = Memo::factory()
        ->forUser($publicUser)
        ->forBook($this->book)
        ->create();

    // 非公開ユーザーのメモ
    $privateMemo = Memo::factory()
        ->forUser($privateUser)
        ->forBook($this->book)
        ->create();

    $response = $this->get("/book/{$this->book->isbn}/memos")
        ->assertStatus(200)
        ->assertJsonCount(1, 'memos')
        ->assertJsonPath('memos.0.id', $publicMemo->id);

    $memos = $response->json('memos');
    $memoIds = array_column($memos, 'id');
    expect($memoIds)->not->toContain($privateMemo->id);
});

test('メモ一覧が本ごとにグループ化されて表示される', function () {
    $books = Book::factory()->count(3)->create();
    
    // 各本に複数のメモを作成
    foreach ($books as $index => $book) {
        Memo::factory()
            ->count(2)
            ->forUser($this->user)
            ->forBook($book)
            ->create();
    }

    $this->actingAs($this->user)
        ->get('/memo/list')
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('features/memo/pages/MemoList')
            ->has('memos', 3)
        );
});

test('他のユーザーのメモは自分のメモ一覧に表示されない', function () {
    $otherUser = User::factory()->create();
    
    // 他のユーザーのメモ
    Memo::factory()
        ->count(3)
        ->forUser($otherUser)
        ->forBook($this->book)
        ->create();

    // 自分のメモ
    $myMemo = Memo::factory()
        ->forUser($this->user)
        ->forBook($this->book)
        ->create();

    $this->actingAs($this->user)
        ->get('/memo/list')
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->has('memos', 1)
        );
});

test('メモ更新時に内容のバリデーションが機能する', function () {
    $memo = Memo::factory()
        ->forUser($this->user)
        ->forBook($this->book)
        ->create();

    $this->actingAs($this->user)
        ->putJson("/memo/{$memo->id}", [
            'memo' => '',
        ])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['memo']);
});

