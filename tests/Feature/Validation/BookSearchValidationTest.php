<?php

use App\Http\Requests\BookSearchRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Validator;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
});

describe('BookSearchRequest', function () {
    test('有効なデータで検証が通る', function () {
        $data = [
            'keyword' => 'Laravel',
            'page' => 1,
            'genre' => '001001',
            'sort' => 'standard',
            'searchMethod' => 'title',
        ];

        $request = new BookSearchRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->passes())->toBeTrue();
    });

    test('全ての項目は任意項目', function () {
        $data = [];

        $request = new BookSearchRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->passes())->toBeTrue();
    });

    test('キーワードが文字列でないとエラー', function () {
        $data = [
            'keyword' => 123,
        ];

        $request = new BookSearchRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('keyword'))->toBeTrue();
    });

    test('キーワードが100文字を超えるとエラー', function () {
        $data = [
            'keyword' => str_repeat('a', 101),
        ];

        $request = new BookSearchRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('keyword'))->toBeTrue();
    });

    test('ページ番号が整数でないとエラー', function () {
        $data = [
            'page' => 'abc',
        ];

        $request = new BookSearchRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('page'))->toBeTrue();
    });

    test('ページ番号が1未満だとエラー', function () {
        $data = [
            'page' => 0,
        ];

        $request = new BookSearchRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('page'))->toBeTrue();
    });

    test('ページ番号が100を超えるとエラー', function () {
        $data = [
            'page' => 101,
        ];

        $request = new BookSearchRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('page'))->toBeTrue();
    });

    test('ソート方法が無効な値だとエラー', function () {
        $data = [
            'sort' => 'invalid_sort',
        ];

        $request = new BookSearchRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('sort'))->toBeTrue();
    });

    test('有効なソート方法は通る', function () {
        $validSorts = ['standard', 'sales', '+releaseDate', '-releaseDate', '+itemPrice', '-itemPrice'];

        foreach ($validSorts as $sort) {
            $data = ['sort' => $sort];
            $request = new BookSearchRequest();
            $validator = Validator::make($data, $request->rules());

            expect($validator->passes())->toBeTrue("Sort method '{$sort}' should be valid");
        }
    });

    test('検索方法が無効な値だとエラー', function () {
        $data = [
            'searchMethod' => 'invalid_method',
        ];

        $request = new BookSearchRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('searchMethod'))->toBeTrue();
    });

    test('有効な検索方法は通る', function () {
        $validMethods = ['title', 'isbn'];

        foreach ($validMethods as $method) {
            $data = ['searchMethod' => $method];
            $request = new BookSearchRequest();
            $validator = Validator::make($data, $request->rules());

            expect($validator->passes())->toBeTrue("Search method '{$method}' should be valid");
        }
    });

    test('カスタムエラーメッセージが正しい', function () {
        $data = [
            'keyword' => str_repeat('a', 101),
        ];

        $request = new BookSearchRequest();
        $validator = Validator::make($data, $request->rules(), $request->messages());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->first('keyword'))->toBe('キーワードは100文字以内で入力してください。');
    });
});