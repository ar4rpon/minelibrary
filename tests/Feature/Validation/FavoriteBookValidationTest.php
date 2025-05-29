<?php

use App\Http\Requests\FavoriteBookToggleRequest;
use App\Http\Requests\FavoriteBookStatusRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Validator;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
});

describe('FavoriteBookToggleRequest', function () {
    test('有効なデータで検証が通る', function () {
        $data = [
            'isbn' => '9784123456789',
            'title' => 'テスト本',
            'author' => 'テスト著者',
            'publisher_name' => 'テスト出版社',
            'sales_date' => '2023-01-01',
            'image_url' => 'https://example.com/image.jpg',
            'item_caption' => '商品説明',
            'item_price' => 1500,
        ];

        $request = new FavoriteBookToggleRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->passes())->toBeTrue();
    });

    test('必須項目が不足するとエラー', function () {
        $requiredFields = ['isbn', 'title', 'author', 'publisher_name', 'sales_date', 'image_url', 'item_caption', 'item_price'];

        foreach ($requiredFields as $field) {
            $data = [
                'isbn' => '9784123456789',
                'title' => 'テスト本',
                'author' => 'テスト著者',
                'publisher_name' => 'テスト出版社',
                'sales_date' => '2023-01-01',
                'image_url' => 'https://example.com/image.jpg',
                'item_caption' => '商品説明',
                'item_price' => 1500,
            ];
            unset($data[$field]);

            $request = new FavoriteBookToggleRequest();
            $validator = Validator::make($data, $request->rules());

            expect($validator->fails())->toBeTrue("Field '{$field}' should be required");
            expect($validator->errors()->has($field))->toBeTrue();
        }
    });

    test('ISBNが13文字を超えるとエラー', function () {
        $data = [
            'isbn' => '12345678901234', // 14文字
            'title' => 'テスト本',
            'author' => 'テスト著者',
            'publisher_name' => 'テスト出版社',
            'sales_date' => '2023-01-01',
            'image_url' => 'https://example.com/image.jpg',
            'item_caption' => '商品説明',
            'item_price' => 1500,
        ];

        $request = new FavoriteBookToggleRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('isbn'))->toBeTrue();
    });

    test('価格が整数でないとエラー', function () {
        $data = [
            'isbn' => '9784123456789',
            'title' => 'テスト本',
            'author' => 'テスト著者',
            'publisher_name' => 'テスト出版社',
            'sales_date' => '2023-01-01',
            'image_url' => 'https://example.com/image.jpg',
            'item_caption' => '商品説明',
            'item_price' => 'abc',
        ];

        $request = new FavoriteBookToggleRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('item_price'))->toBeTrue();
    });

    test('価格が負の値だとエラー', function () {
        $data = [
            'isbn' => '9784123456789',
            'title' => 'テスト本',
            'author' => 'テスト著者',
            'publisher_name' => 'テスト出版社',
            'sales_date' => '2023-01-01',
            'image_url' => 'https://example.com/image.jpg',
            'item_caption' => '商品説明',
            'item_price' => -100,
        ];

        $request = new FavoriteBookToggleRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('item_price'))->toBeTrue();
    });

    test('価格が上限を超えるとエラー', function () {
        $data = [
            'isbn' => '9784123456789',
            'title' => 'テスト本',
            'author' => 'テスト著者',
            'publisher_name' => 'テスト出版社',
            'sales_date' => '2023-01-01',
            'image_url' => 'https://example.com/image.jpg',
            'item_caption' => '商品説明',
            'item_price' => 100000, // 99999を超える
        ];

        $request = new FavoriteBookToggleRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('item_price'))->toBeTrue();
    });
});

describe('FavoriteBookStatusRequest', function () {
    test('有効なデータで検証が通る', function () {
        $data = [
            'isbn' => '9784123456789',
            'readStatus' => 'reading',
        ];

        $request = new FavoriteBookStatusRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->passes())->toBeTrue();
    });

    test('ISBNは必須', function () {
        $data = [
            'readStatus' => 'reading',
        ];

        $request = new FavoriteBookStatusRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('isbn'))->toBeTrue();
    });

    test('読書状態は任意項目', function () {
        $data = [
            'isbn' => '9784123456789',
        ];

        $request = new FavoriteBookStatusRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->passes())->toBeTrue();
    });

    test('有効な読書状態は通る', function () {
        $validStatuses = ['want_read', 'reading', 'done_read'];

        foreach ($validStatuses as $status) {
            $data = [
                'isbn' => '9784123456789',
                'readStatus' => $status,
            ];

            $request = new FavoriteBookStatusRequest();
            $validator = Validator::make($data, $request->rules());

            expect($validator->passes())->toBeTrue("Read status '{$status}' should be valid");
        }
    });

    test('無効な読書状態はエラー', function () {
        $data = [
            'isbn' => '9784123456789',
            'readStatus' => 'invalid_status',
        ];

        $request = new FavoriteBookStatusRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('readStatus'))->toBeTrue();
    });

    test('カスタムエラーメッセージが正しい', function () {
        $data = [
            'readStatus' => 'invalid_status',
        ];

        $request = new FavoriteBookStatusRequest();
        $validator = Validator::make($data, $request->rules(), $request->messages());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->first('isbn'))->toBe('ISBNは必須です。');
        expect($validator->errors()->first('readStatus'))->toBe('読書状態は want_read, reading, done_read のいずれかを指定してください。');
    });
});