<?php

use App\Http\Requests\BookShelfStoreRequest;
use App\Http\Requests\BookShelfUpdateRequest;
use App\Http\Requests\BookShelfBookRequest;
use App\Http\Requests\BookShelfRemoveBookRequest;
use App\Models\User;
use App\Models\Book;
use App\Models\BookShelf;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Validator;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->book = Book::factory()->create();
    $this->bookShelf = BookShelf::factory()->create(['user_id' => $this->user->id]);
});

describe('BookShelfStoreRequest', function () {
    test('有効なデータで検証が通る', function () {
        $data = [
            'book_shelf_name' => 'テスト本棚',
            'description' => 'これはテスト用の本棚です',
        ];

        $request = new BookShelfStoreRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->passes())->toBeTrue();
    });

    test('本棚名は必須', function () {
        $data = [
            'description' => '説明',
        ];

        $request = new BookShelfStoreRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('book_shelf_name'))->toBeTrue();
    });

    test('説明は必須', function () {
        $data = [
            'book_shelf_name' => '本棚名',
        ];

        $request = new BookShelfStoreRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('description'))->toBeTrue();
    });

    test('本棚名が100文字を超えるとエラー', function () {
        $data = [
            'book_shelf_name' => str_repeat('a', 101),
            'description' => '説明',
        ];

        $request = new BookShelfStoreRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('book_shelf_name'))->toBeTrue();
    });

    test('説明が500文字を超えるとエラー', function () {
        $data = [
            'book_shelf_name' => '本棚名',
            'description' => str_repeat('a', 501),
        ];

        $request = new BookShelfStoreRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('description'))->toBeTrue();
    });
});

describe('BookShelfUpdateRequest', function () {
    test('有効なデータで検証が通る', function () {
        $data = [
            'book_shelf_name' => '更新された本棚',
            'description' => '更新された説明',
            'is_public' => true,
        ];

        $request = new BookShelfUpdateRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->passes())->toBeTrue();
    });

    test('公開設定は必須', function () {
        $data = [
            'book_shelf_name' => '本棚名',
            'description' => '説明',
        ];

        $request = new BookShelfUpdateRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('is_public'))->toBeTrue();
    });

    test('公開設定がboolean型でないとエラー', function () {
        $data = [
            'book_shelf_name' => '本棚名',
            'description' => '説明',
            'is_public' => 'invalid',
        ];

        $request = new BookShelfUpdateRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('is_public'))->toBeTrue();
    });
});

describe('BookShelfBookRequest', function () {
    test('有効なデータで検証が通る', function () {
        $data = [
            'book_shelf_id' => $this->bookShelf->id,
            'isbns' => [$this->book->isbn],
        ];

        $request = new BookShelfBookRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->passes())->toBeTrue();
    });

    test('本棚IDは必須', function () {
        $data = [
            'isbns' => [$this->book->isbn],
        ];

        $request = new BookShelfBookRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('book_shelf_id'))->toBeTrue();
    });

    test('ISBNリストは必須', function () {
        $data = [
            'book_shelf_id' => $this->bookShelf->id,
        ];

        $request = new BookShelfBookRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('isbns'))->toBeTrue();
    });

    test('ISBNリストは配列である必要がある', function () {
        $data = [
            'book_shelf_id' => $this->bookShelf->id,
            'isbns' => 'not_array',
        ];

        $request = new BookShelfBookRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('isbns'))->toBeTrue();
    });

    test('空のISBNリストはエラー', function () {
        $data = [
            'book_shelf_id' => $this->bookShelf->id,
            'isbns' => [],
        ];

        $request = new BookShelfBookRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('isbns'))->toBeTrue();
    });

    test('存在しない本棚IDはエラー', function () {
        $data = [
            'book_shelf_id' => 99999,
            'isbns' => [$this->book->isbn],
        ];

        $request = new BookShelfBookRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('book_shelf_id'))->toBeTrue();
    });

    test('存在しないISBNはエラー', function () {
        $data = [
            'book_shelf_id' => $this->bookShelf->id,
            'isbns' => ['9999999999999'],
        ];

        $request = new BookShelfBookRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('isbns.0'))->toBeTrue();
    });

    test('複数のISBNで一部が無効だとエラー', function () {
        $validBook = Book::factory()->create();
        $data = [
            'book_shelf_id' => $this->bookShelf->id,
            'isbns' => [$validBook->isbn, '9999999999999'],
        ];

        $request = new BookShelfBookRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('isbns.1'))->toBeTrue();
    });
});

describe('BookShelfRemoveBookRequest', function () {
    test('有効なデータで検証が通る', function () {
        $data = [
            'book_shelf_id' => $this->bookShelf->id,
            'isbn' => $this->book->isbn,
        ];

        $request = new BookShelfRemoveBookRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->passes())->toBeTrue();
    });

    test('本棚IDは必須', function () {
        $data = [
            'isbn' => $this->book->isbn,
        ];

        $request = new BookShelfRemoveBookRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('book_shelf_id'))->toBeTrue();
    });

    test('ISBNは必須', function () {
        $data = [
            'book_shelf_id' => $this->bookShelf->id,
        ];

        $request = new BookShelfRemoveBookRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('isbn'))->toBeTrue();
    });

    test('カスタムエラーメッセージが正しい', function () {
        $data = [];

        $request = new BookShelfRemoveBookRequest();
        $validator = Validator::make($data, $request->rules(), $request->messages());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->first('book_shelf_id'))->toBe('本棚IDは必須です。');
        expect($validator->errors()->first('isbn'))->toBe('ISBNは必須です。');
    });
});