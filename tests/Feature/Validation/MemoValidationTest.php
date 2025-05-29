<?php

use App\Http\Requests\MemoStoreRequest;
use App\Http\Requests\MemoUpdateRequest;
use App\Models\User;
use App\Models\Book;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Validator;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->book = Book::factory()->create();
});

describe('MemoStoreRequest', function () {
    test('有効なデータで検証が通る', function () {
        $data = [
            'isbn' => $this->book->isbn,
            'memo' => 'これは有効なメモです',
            'memo_chapter' => 5,
            'memo_page' => 100,
        ];

        $request = new MemoStoreRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->passes())->toBeTrue();
    });

    test('ISBNが必須である', function () {
        $data = [
            'memo' => 'メモ内容',
        ];

        $request = new MemoStoreRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('isbn'))->toBeTrue();
    });

    test('メモ内容が必須である', function () {
        $data = [
            'isbn' => $this->book->isbn,
        ];

        $request = new MemoStoreRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('memo'))->toBeTrue();
    });

    test('ISBNが13文字を超えるとエラー', function () {
        $data = [
            'isbn' => '12345678901234', // 14文字
            'memo' => 'メモ内容',
        ];

        $request = new MemoStoreRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('isbn'))->toBeTrue();
    });

    test('メモ内容が2000文字を超えるとエラー', function () {
        $data = [
            'isbn' => $this->book->isbn,
            'memo' => str_repeat('a', 2001),
        ];

        $request = new MemoStoreRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('memo'))->toBeTrue();
    });

    test('章番号が整数でないとエラー', function () {
        $data = [
            'isbn' => $this->book->isbn,
            'memo' => 'メモ内容',
            'memo_chapter' => 'abc',
        ];

        $request = new MemoStoreRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('memo_chapter'))->toBeTrue();
    });

    test('ページ番号が整数でないとエラー', function () {
        $data = [
            'isbn' => $this->book->isbn,
            'memo' => 'メモ内容',
            'memo_page' => 'xyz',
        ];

        $request = new MemoStoreRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('memo_page'))->toBeTrue();
    });

    test('章番号が範囲外だとエラー', function () {
        $data = [
            'isbn' => $this->book->isbn,
            'memo' => 'メモ内容',
            'memo_chapter' => 1000, // 999を超える
        ];

        $request = new MemoStoreRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('memo_chapter'))->toBeTrue();
    });

    test('ページ番号が範囲外だとエラー', function () {
        $data = [
            'isbn' => $this->book->isbn,
            'memo' => 'メモ内容',
            'memo_page' => 10000, // 9999を超える
        ];

        $request = new MemoStoreRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('memo_page'))->toBeTrue();
    });

    test('章とページは任意項目', function () {
        $data = [
            'isbn' => $this->book->isbn,
            'memo' => 'メモ内容',
        ];

        $request = new MemoStoreRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->passes())->toBeTrue();
    });
});

describe('MemoUpdateRequest', function () {
    test('有効なデータで検証が通る', function () {
        $data = [
            'memo' => '更新されたメモ内容',
            'memo_chapter' => 3,
            'memo_page' => 50,
        ];

        $request = new MemoUpdateRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->passes())->toBeTrue();
    });

    test('メモ内容が必須である', function () {
        $data = [
            'memo_chapter' => 3,
        ];

        $request = new MemoUpdateRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('memo'))->toBeTrue();
    });

    test('カスタムエラーメッセージが正しい', function () {
        $data = [
            'memo' => '', // 空文字
        ];

        $request = new MemoStoreRequest();
        $validator = Validator::make($data, $request->rules(), $request->messages());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->first('memo'))->toBe('メモ内容は必須です。');
    });
});