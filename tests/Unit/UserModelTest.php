<?php

use App\Models\User;
use App\Models\Book;
use App\Models\FavoriteBook;
use App\Models\FavoriteBookShelf;
use App\Models\BookShelf;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(TestCase::class, RefreshDatabase::class);

test('ユーザーは必要な属性を持つ', function () {
    $user = User::factory()->create([
        'name' => 'テストユーザー',
        'email' => 'test@example.com',
        'is_memo_publish' => true,
    ]);

    expect($user->name)->toBe('テストユーザー');
    expect($user->email)->toBe('test@example.com');
    expect($user->is_memo_publish)->toBe(true);
});

test('パスワードは自動的にハッシュ化される', function () {
    $user = User::factory()->create([
        'password' => 'password123',
    ]);

    expect($user->password)->not->toBe('password123');
    expect(password_verify('password123', $user->password))->toBeTrue();
});

test('パスワードは隠し属性に含まれる', function () {
    $user = User::factory()->create();
    $array = $user->toArray();

    expect($array)->not->toHaveKey('password');
    expect($array)->not->toHaveKey('remember_token');
});

test('ユーザーは複数のお気に入り本を持つことができる', function () {
    $user = User::factory()->create();
    $books = Book::factory()->count(3)->create();

    foreach ($books as $book) {
        FavoriteBook::factory()
            ->forUser($user)
            ->forBook($book)
            ->create();
    }

    expect($user->favoriteBooks)->toHaveCount(3);
    expect($user->favoriteBooks->first())->toBeInstanceOf(FavoriteBook::class);
});

test('ユーザーは複数のお気に入り本棚を持つことができる', function () {
    $user = User::factory()->create();
    $bookShelves = BookShelf::factory()->count(2)->create();

    foreach ($bookShelves as $bookShelf) {
        FavoriteBookShelf::factory()
            ->forUser($user)
            ->forBookShelf($bookShelf)
            ->create();
    }

    expect($user->favoriteBookLists)->toHaveCount(2);
    expect($user->favoriteBookLists->first())->toBeInstanceOf(FavoriteBookShelf::class);
});

test('ユーザーファクトリーは期待通りに動作する', function () {
    $user = User::factory()->create();

    expect($user)->toBeInstanceOf(User::class);
    expect($user->name)->toBeString();
    expect($user->email)->toContain('@');
    expect($user->password)->toBeString();
});

test('メモ公開設定がボール値として正しく扱われる', function () {
    $publicUser = User::factory()->create(['is_memo_publish' => true]);
    $privateUser = User::factory()->create(['is_memo_publish' => false]);

    expect($publicUser->is_memo_publish)->toBeTrue();
    expect($privateUser->is_memo_publish)->toBeFalse();
});

test('email_verified_atはdatetime型でキャストされる', function () {
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    expect($user->email_verified_at)->toBeInstanceOf(\Illuminate\Support\Carbon::class);
});