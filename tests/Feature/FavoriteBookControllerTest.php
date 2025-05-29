<?php

use App\Models\User;
use App\Models\Book;
use App\Models\FavoriteBook;
use Tests\Helpers\AuthTestHelper;
use Tests\Helpers\DatabaseTestHelper;
use Tests\Helpers\ApiTestHelper;

uses(AuthTestHelper::class, DatabaseTestHelper::class, ApiTestHelper::class);

beforeEach(function () {
    $this->user = User::factory()->create();
});

test('認証されていないユーザーはお気に入り一覧にアクセスできない', function () {
    $this->get('/favorite-book/list')
        ->assertRedirect('/login');
});

test('認証済みユーザーはお気に入り一覧を表示できる', function () {
    $this->actingAs($this->user)
        ->get('/favorite-book/list')
        ->assertStatus(200);
});

test('本をお気に入りに追加できる', function () {
    $book = Book::factory()->create();

    $this->actingAs($this->user)
        ->postJson('/books/toggle-favorite', [
            'isbn' => $book->isbn,
            'title' => $book->title,
            'author' => $book->author,
            'publisher_name' => $book->publisher_name,
            'sales_date' => $book->sales_date,
            'image_url' => $book->image_url,
            'item_caption' => $book->item_caption,
            'item_price' => $book->item_price,
        ])
        ->assertStatus(200)
        ->assertJson([
            'isFavorite' => true,
        ]);

    $this->assertDatabaseHas('favorite_books', [
        'user_id' => $this->user->id,
        'isbn' => $book->isbn,
    ]);
});

test('お気に入りの本を削除できる', function () {
    $book = Book::factory()->create();
    $favoriteBook = FavoriteBook::factory()
        ->forUser($this->user)
        ->forBook($book)
        ->create();

    $this->actingAs($this->user)
        ->postJson('/books/toggle-favorite', [
            'isbn' => $book->isbn,
            'title' => $book->title,
            'author' => $book->author,
            'publisher_name' => $book->publisher_name,
            'sales_date' => $book->sales_date,
            'image_url' => $book->image_url,
            'item_caption' => $book->item_caption,
            'item_price' => $book->item_price,
        ])
        ->assertStatus(200)
        ->assertJson([
            'isFavorite' => false,
        ]);

    $this->assertDatabaseMissing('favorite_books', [
        'user_id' => $this->user->id,
        'isbn' => $book->isbn,
    ]);
});

test('お気に入りの状態を取得できる', function () {
    $book1 = Book::factory()->create();
    $book2 = Book::factory()->create();
    
    FavoriteBook::factory()
        ->forUser($this->user)
        ->forBook($book1)
        ->create();

    $this->actingAs($this->user)
        ->getJson('/books/favorite-status?isbn=' . $book1->isbn)
        ->assertStatus(200)
        ->assertJson([
            'isFavorite' => true,
        ]);

    $this->actingAs($this->user)
        ->getJson('/books/favorite-status?isbn=' . $book2->isbn)
        ->assertStatus(200)
        ->assertJson([
            'isFavorite' => false,
        ]);
});

test('読書状態を更新できる', function () {
    $book = Book::factory()->create();
    $favoriteBook = FavoriteBook::factory()
        ->forUser($this->user)
        ->forBook($book)
        ->wantRead()
        ->create();

    $this->actingAs($this->user)
        ->postJson('/books/update-status', [
            'isbn' => $book->isbn,
            'readStatus' => 'reading',
        ])
        ->assertStatus(200)
        ->assertJson([
            'readStatus' => 'reading',
        ]);

    $this->assertDatabaseHas('favorite_books', [
        'user_id' => $this->user->id,
        'isbn' => $book->isbn,
        'read_status' => 'reading',
    ]);
});

test('存在しない本の読書状態を更新しようとするとエラー', function () {
    $book = Book::factory()->create();

    $this->actingAs($this->user)
        ->postJson('/books/update-status', [
            'isbn' => $book->isbn,
            'readStatus' => 'reading',
        ])
        ->assertStatus(200);
});

test('お気に入り一覧にステータスごとにグループ化されて表示される', function () {
    // 本の作成
    $books = Book::factory()->count(5)->create();
    
    // お気に入りの作成（異なるステータス）
    FavoriteBook::factory()
        ->forUser($this->user)
        ->forBook($books[0])
        ->wantRead()
        ->create();
    
    FavoriteBook::factory()
        ->forUser($this->user)
        ->forBook($books[1])
        ->reading()
        ->create();
    
    FavoriteBook::factory()
        ->forUser($this->user)
        ->forBook($books[2])
        ->doneRead()
        ->create();

    $this->actingAs($this->user)
        ->get('/favorite-book/list')
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->component('features/book/pages/FavoriteBookList')
            ->has('favorites', 3)
        );
});

test('本棚用のお気に入り本一覧を取得できる', function () {
    $books = Book::factory()->count(3)->create();
    
    foreach ($books as $book) {
        FavoriteBook::factory()
            ->forUser($this->user)
            ->forBook($book)
            ->create();
    }

    $this->actingAs($this->user)
        ->get('/book-shelf/get/favorite-books')
        ->assertStatus(200)
        ->assertJsonCount(3);
});

test('他のユーザーのお気に入りは表示されない', function () {
    $otherUser = User::factory()->create();
    $book = Book::factory()->create();
    
    // 他のユーザーのお気に入り
    FavoriteBook::factory()
        ->forUser($otherUser)
        ->forBook($book)
        ->create();

    $this->actingAs($this->user)
        ->get('/favorite-book/list')
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page
            ->has('favorites', 0)
        );
});