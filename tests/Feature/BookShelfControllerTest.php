<?php

use App\Models\User;
use App\Models\BookShelf;
use App\Models\Book;
use Tests\Helpers\AuthTestHelper;
use Tests\Helpers\DatabaseTestHelper;
use Tests\Helpers\ApiTestHelper;
use Illuminate\Support\Facades\Session;

uses(AuthTestHelper::class, DatabaseTestHelper::class, ApiTestHelper::class);

beforeEach(function () {
    $this->user = User::factory()->create();
});

test('認証されていないユーザーは本棚一覧にアクセスできない', function () {
    $this->get('/book-shelf/list')
        ->assertRedirect('/login');
});

test('認証済みユーザーは本棚一覧を表示できる', function () {
    $this->actingAs($this->user)
        ->get('/book-shelf/list')
        ->assertStatus(200);
});

test('ユーザーは新しい本棚を作成できる', function () {
    $bookShelfData = [
        'book_shelf_name' => 'テスト本棚',
        'description' => 'これはテスト用の本棚です',
    ];

    Session::start();
    $this->actingAs($this->user)
        ->withSession(['_token' => Session::token()])
        ->post('/api/book-shelf/create', array_merge($bookShelfData, ['_token' => Session::token()]))
        ->assertStatus(201)
        ->assertJson([
            'book_shelf_name' => 'テスト本棚',
            'description' => 'これはテスト用の本棚です',
            'is_public' => true,
        ]);

    $this->assertDatabaseHas('book_shelves', [
        'user_id' => $this->user->id,
        'book_shelf_name' => 'テスト本棚',
    ]);
});

test('ユーザーは自分の本棚を更新できる', function () {
    $bookShelf = BookShelf::factory()->forUser($this->user)->create();

    $updateData = [
        'book_shelf_name' => '更新された本棚名',
        'description' => '更新された説明',
        'is_public' => false,
    ];

    Session::start();
    $this->actingAs($this->user)
        ->withSession(['_token' => Session::token()])
        ->put("/api/book-shelf/update/{$bookShelf->id}", array_merge($updateData, ['_token' => Session::token()]))
        ->assertStatus(200);

    $this->assertDatabaseHas('book_shelves', [
        'id' => $bookShelf->id,
        'book_shelf_name' => '更新された本棚名',
        'description' => '更新された説明',
        'is_public' => false,
    ]);
});

test('ユーザーは他人の本棚を更新できない', function () {
    $otherUser = User::factory()->create();
    $bookShelf = BookShelf::factory()->forUser($otherUser)->create();

    Session::start();
    $this->actingAs($this->user)
        ->withSession(['_token' => Session::token()])
        ->put("/api/book-shelf/update/{$bookShelf->id}", [
            'book_shelf_name' => '不正な更新',
            'description' => '不正な説明',
            'is_public' => false,
            '_token' => Session::token(),
        ])
        ->assertStatus(404);
});

test('ユーザーは自分の本棚を削除できる', function () {
    $bookShelf = BookShelf::factory()->forUser($this->user)->create();

    Session::start();
    $this->actingAs($this->user)
        ->withSession(['_token' => Session::token()])
        ->delete("/api/book-shelf/delete/{$bookShelf->id}", ['_token' => Session::token()])
        ->assertStatus(200);

    $this->assertDatabaseMissing('book_shelves', [
        'id' => $bookShelf->id,
    ]);
});

test('本棚に本を追加できる', function () {
    $bookShelf = BookShelf::factory()->forUser($this->user)->create();
    $books = Book::factory()->count(3)->create();

    Session::start();
    $this->actingAs($this->user)
        ->withSession(['_token' => Session::token()])
        ->post('/api/book-shelf/add/books', [
            'book_shelf_id' => $bookShelf->id,
            'isbns' => $books->pluck('isbn')->toArray(),
            '_token' => Session::token(),
        ])
        ->assertStatus(200);

    foreach ($books as $book) {
        $this->assertDatabaseHas('book_shelf_book', [
            'book_shelf_id' => $bookShelf->id,
            'isbn' => $book->isbn,
        ]);
    }
});

test('本棚から本を削除できる', function () {
    $bookShelf = BookShelf::factory()->forUser($this->user)->create();
    $book = Book::factory()->create();
    $bookShelf->addBook($book->isbn);

    Session::start();
    $this->actingAs($this->user)
        ->withSession(['_token' => Session::token()])
        ->post("/api/book-shelf/remove-book", [
            'book_shelf_id' => $bookShelf->id,
            'isbn' => $book->isbn,
            '_token' => Session::token(),
        ])
        ->assertStatus(200);

    $this->assertDatabaseMissing('book_shelf_book', [
        'book_shelf_id' => $bookShelf->id,
        'isbn' => $book->isbn,
    ]);
});

test('公開本棚一覧を表示できる', function () {
    $otherUser = User::factory()->create();
    BookShelf::factory()->count(3)->forUser($otherUser)->public()->create();
    BookShelf::factory()->count(2)->forUser($otherUser)->private()->create();

    $this->actingAs($this->user)
        ->get("/user/{$otherUser->id}/book-shelves")
        ->assertStatus(200);
});

test('非公開本棚は他のユーザーに表示されない', function () {
    $otherUser = User::factory()->create();
    $privateBookShelf = BookShelf::factory()->forUser($otherUser)->private()->create();

    $this->actingAs($this->user)
        ->get("/user/{$otherUser->id}/book-shelf/{$privateBookShelf->id}")
        ->assertStatus(404);
});