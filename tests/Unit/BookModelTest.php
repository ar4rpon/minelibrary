<?php

use App\Models\Book;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(TestCase::class, RefreshDatabase::class);

test('本は必要な属性を持つ', function () {
    $bookData = [
        'isbn' => '9784123456789',
        'title' => 'テスト本',
        'author' => 'テスト著者',
        'publisher_name' => 'テスト出版社',
        'sales_date' => '2023-01-01',
        'image_url' => 'https://example.com/image.jpg',
        'item_caption' => '本の説明',
        'item_price' => 1500,
    ];

    $book = Book::factory()->create($bookData);

    expect($book->isbn)->toBe('9784123456789');
    expect($book->title)->toBe('テスト本');
    expect($book->author)->toBe('テスト著者');
    expect($book->publisher_name)->toBe('テスト出版社');
    expect($book->sales_date)->toBe('2023-01-01');
    expect($book->image_url)->toBe('https://example.com/image.jpg');
    expect($book->item_caption)->toBe('本の説明');
    expect($book->item_price)->toBe(1500);
});

test('本の主キーはISBNである', function () {
    $book = Book::factory()->create(['isbn' => '9784123456789']);

    expect($book->getKey())->toBe('9784123456789');
    expect($book->getKeyName())->toBe('isbn');
    expect($book->getIncrementing())->toBeFalse();
    expect($book->getKeyType())->toBe('string');
});

test('item_priceは整数型でキャストされる', function () {
    $book = Book::factory()->create(['item_price' => '1500']);

    expect($book->item_price)->toBeInt();
    expect($book->item_price)->toBe(1500);
});

test('addBookメソッドで新しい本を追加できる', function () {
    $bookData = [
        'isbn' => '9784987654321',
        'title' => '新しい本',
        'author' => '新著者',
        'publisher_name' => '新出版社',
        'sales_date' => '2023-02-01',
        'image_url' => 'https://example.com/new.jpg',
        'item_caption' => '新しい本の説明',
        'item_price' => 2000,
    ];

    $book = new Book();
    $createdBook = $book->addBook($bookData);

    expect($createdBook)->toBeInstanceOf(Book::class);
    expect($createdBook->isbn)->toBe('9784987654321');
    expect($createdBook->title)->toBe('新しい本');

    $this->assertDatabaseHas('books', $bookData);
});

test('getBookInfoメソッドでISBNから本の情報を取得できる', function () {
    $book = Book::factory()->create([
        'isbn' => '9784555666777',
        'title' => '検索テスト本',
    ]);

    $bookInstance = new Book();
    $foundBook = $bookInstance->getBookInfo('9784555666777');

    expect($foundBook)->toBeInstanceOf(Book::class);
    expect($foundBook->isbn)->toBe('9784555666777');
    expect($foundBook->title)->toBe('検索テスト本');
});

test('存在しないISBNではnullが返される', function () {
    $bookInstance = new Book();
    $foundBook = $bookInstance->getBookInfo('9999999999999');

    expect($foundBook)->toBeNull();
});

test('本ファクトリーは期待通りに動作する', function () {
    $book = Book::factory()->create();

    expect($book)->toBeInstanceOf(Book::class);
    expect($book->isbn)->toBeString();
    expect($book->title)->toBeString();
    expect($book->author)->toBeString();
    expect($book->publisher_name)->toBeString();
    expect($book->item_price)->toBeInt();
});

test('複数の本を作成できる', function () {
    $books = Book::factory()->count(3)->create();

    expect($books)->toHaveCount(3);
    expect($books->first())->toBeInstanceOf(Book::class);
    
    // 各本のISBNがユニークであることを確認
    $isbns = $books->pluck('isbn')->toArray();
    expect($isbns)->toHaveCount(3);
    expect(array_unique($isbns))->toHaveCount(3);
});