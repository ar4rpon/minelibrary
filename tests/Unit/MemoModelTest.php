<?php

use App\Models\Memo;
use App\Models\User;
use App\Models\Book;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(TestCase::class, RefreshDatabase::class);

test('メモは必要な属性を持つ', function () {
    $user = User::factory()->create();
    $book = Book::factory()->create();

    $memo = Memo::factory()->create([
        'user_id' => $user->id,
        'isbn' => $book->isbn,
        'memo' => 'テストメモ',
        'memo_chapter' => 5,
        'memo_page' => 100,
    ]);

    expect($memo->user_id)->toBe($user->id);
    expect($memo->isbn)->toBe($book->isbn);
    expect($memo->memo)->toBe('テストメモ');
    expect($memo->memo_chapter)->toBe(5);
    expect($memo->memo_page)->toBe(100);
});

test('memo_pageとmemo_chapterは整数型でキャストされる', function () {
    $memo = Memo::factory()->create([
        'memo_chapter' => '10',
        'memo_page' => '250',
    ]);

    expect($memo->memo_chapter)->toBeInt();
    expect($memo->memo_page)->toBeInt();
    expect($memo->memo_chapter)->toBe(10);
    expect($memo->memo_page)->toBe(250);
});

test('メモはユーザーに属する', function () {
    $user = User::factory()->create();
    $memo = Memo::factory()->forUser($user)->create();

    expect($memo->user)->toBeInstanceOf(User::class);
    expect($memo->user->id)->toBe($user->id);
});

test('メモは本に属する', function () {
    $book = Book::factory()->create();
    $memo = Memo::factory()->forBook($book)->create();

    expect($memo->book)->toBeInstanceOf(Book::class);
    expect($memo->book->isbn)->toBe($book->isbn);
});

test('createMemoメソッドで新しいメモを作成できる', function () {
    $user = User::factory()->create();
    $book = Book::factory()->create();

    $memo = Memo::createMemo(
        $book->isbn,
        'これは素晴らしい本です',
        $user->id,
        3,
        42
    );

    expect($memo)->toBeInstanceOf(Memo::class);
    expect($memo->isbn)->toBe($book->isbn);
    expect($memo->memo)->toBe('これは素晴らしい本です');
    expect($memo->user_id)->toBe($user->id);
    expect($memo->memo_chapter)->toBe(3);
    expect($memo->memo_page)->toBe(42);

    $this->assertDatabaseHas('memos', [
        'isbn' => $book->isbn,
        'memo' => 'これは素晴らしい本です',
        'user_id' => $user->id,
    ]);
});

test('章とページなしでメモを作成できる', function () {
    $user = User::factory()->create();
    $book = Book::factory()->create();

    $memo = Memo::createMemo(
        $book->isbn,
        '全体的な感想',
        $user->id
    );

    expect($memo->memo_chapter)->toBeNull();
    expect($memo->memo_page)->toBeNull();
    expect($memo->memo)->toBe('全体的な感想');
});

test('updateMemoメソッドでメモを更新できる', function () {
    $memo = Memo::factory()->create([
        'memo' => '古いメモ',
        'memo_chapter' => 1,
        'memo_page' => 10,
    ]);

    $result = $memo->updateMemo('新しいメモ', 5, 100);

    expect($result)->toBeTrue();
    expect($memo->fresh()->memo)->toBe('新しいメモ');
    expect($memo->fresh()->memo_chapter)->toBe(5);
    expect($memo->fresh()->memo_page)->toBe(100);
});

test('章とページをnullに更新できる', function () {
    $memo = Memo::factory()->create([
        'memo' => 'テストメモ',
        'memo_chapter' => 1,
        'memo_page' => 10,
    ]);

    $memo->updateMemo('更新されたメモ', null, null);

    expect($memo->fresh()->memo)->toBe('更新されたメモ');
    expect($memo->fresh()->memo_chapter)->toBeNull();
    expect($memo->fresh()->memo_page)->toBeNull();
});

test('メモファクトリーは期待通りに動作する', function () {
    $memo = Memo::factory()->create();

    expect($memo)->toBeInstanceOf(Memo::class);
    expect($memo->memo)->toBeString();
    expect($memo->isbn)->toBeString();
    expect($memo->user_id)->toBeInt();
});

test('複数のメモを作成できる', function () {
    $user = User::factory()->create();
    $book = Book::factory()->create();

    $memos = Memo::factory()
        ->count(3)
        ->forUser($user)
        ->forBook($book)
        ->create();

    expect($memos)->toHaveCount(3);
    expect($memos->first())->toBeInstanceOf(Memo::class);
    expect($memos->pluck('user_id')->unique())->toHaveCount(1);
    expect($memos->pluck('isbn')->unique())->toHaveCount(1);
});