<?php

use App\Models\User;
use App\Models\Book;
use App\Models\BookShelf;
use App\Models\ShareLink;
use Tests\Helpers\AuthTestHelper;
use Tests\Helpers\DatabaseTestHelper;
use Tests\Helpers\ApiTestHelper;

uses(AuthTestHelper::class, DatabaseTestHelper::class, ApiTestHelper::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->bookShelf = BookShelf::factory()->create(['user_id' => $this->user->id]);
});

test('認証済みユーザーは自分の本棚の共有リンクを生成できる', function () {
    $this->actingAs($this->user)
        ->postJson('/book-shelf/generate-share-link', [
            'book_shelf_id' => $this->bookShelf->id,
        ])
        ->assertStatus(200)
        ->assertJsonStructure([
            'share_url',
            'expiry_date',
        ]);

    $this->assertDatabaseHas('share_links', [
        'book_shelf_id' => $this->bookShelf->id,
    ]);
});

test('他人の本棚の共有リンクは生成できない', function () {
    $otherUser = User::factory()->create();
    $otherBookShelf = BookShelf::factory()->create(['user_id' => $otherUser->id]);

    $this->actingAs($this->user)
        ->postJson('/book-shelf/generate-share-link', [
            'book_shelf_id' => $otherBookShelf->id,
        ])
        ->assertStatus(500);
});

test('存在しない本棚IDで共有リンク生成はエラーになる', function () {
    $this->actingAs($this->user)
        ->postJson('/book-shelf/generate-share-link', [
            'book_shelf_id' => 99999,
        ])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['book_shelf_id']);
});

test('共有リンクのバリデーションが機能する', function () {
    $this->actingAs($this->user)
        ->postJson('/book-shelf/generate-share-link', [])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['book_shelf_id']);
});

test('認証されていないユーザーは共有リンクを生成できない', function () {
    $this->postJson('/book-shelf/generate-share-link', [
        'book_shelf_id' => $this->bookShelf->id,
    ])
        ->assertStatus(401);
});

test('有効な共有リンクで本棚を表示できる', function () {
    $shareLink = ShareLink::factory()
        ->forBookShelf($this->bookShelf)
        ->create();

    $book = Book::factory()->create();
    $this->bookShelf->addBook($book->isbn);

    $this->get("/shared-booklist/{$shareLink->share_token}")
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('features/bookshelf/pages/SharedBookShelfDetail')
            ->has('bookShelf')
            ->has('books')
            ->where('isShared', true)
            ->has('expiryDate')
        );
});

test('期限切れの共有リンクはアクセスできない', function () {
    $shareLink = ShareLink::factory()
        ->forBookShelf($this->bookShelf)
        ->expired()
        ->create();

    $this->get("/shared-booklist/{$shareLink->share_token}")
        ->assertStatus(403);
});

test('存在しない共有トークンは404エラー', function () {
    $this->get('/shared-booklist/nonexistent-token')
        ->assertStatus(404);
});

test('共有リンクで表示される本棚には書籍が含まれる', function () {
    $shareLink = ShareLink::factory()
        ->forBookShelf($this->bookShelf)
        ->create();

    $books = Book::factory()->count(3)->create();
    foreach ($books as $book) {
        $this->bookShelf->addBook($book->isbn);
    }

    $this->get("/shared-booklist/{$shareLink->share_token}")
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->has('books', 3)
            ->where('books.0.book.title', $books[0]->title)
        );
});

test('共有リンクで本棚の所有者名が表示される', function () {
    $shareLink = ShareLink::factory()
        ->forBookShelf($this->bookShelf)
        ->create();

    $this->get("/shared-booklist/{$shareLink->share_token}")
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->where('bookShelf.user_name', $this->user->name)
        );
});

test('共有リンクの有効期限がレスポンスに含まれる', function () {
    $shareLink = ShareLink::factory()
        ->forBookShelf($this->bookShelf)
        ->create();

    $this->get("/shared-booklist/{$shareLink->share_token}")
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->where('expiryDate', $shareLink->expiry_date->toIso8601String())
        );
});

test('共有リンク生成時にユニークなトークンが生成される', function () {
    $response1 = $this->actingAs($this->user)
        ->postJson('/book-shelf/generate-share-link', [
            'book_shelf_id' => $this->bookShelf->id,
        ]);

    $bookShelf2 = BookShelf::factory()->create(['user_id' => $this->user->id]);
    $response2 = $this->actingAs($this->user)
        ->postJson('/book-shelf/generate-share-link', [
            'book_shelf_id' => $bookShelf2->id,
        ]);

    expect($response1->json('share_url'))->not->toBe($response2->json('share_url'));
});