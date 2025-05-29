<?php

use App\Http\Requests\ShareLinkRequest;
use App\Models\User;
use App\Models\BookShelf;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Validator;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->bookShelf = BookShelf::factory()->create(['user_id' => $this->user->id]);
});

describe('ShareLinkRequest', function () {
    test('有効なデータで検証が通る', function () {
        $data = [
            'book_shelf_id' => $this->bookShelf->id,
        ];

        $request = new ShareLinkRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->passes())->toBeTrue();
    });

    test('本棚IDは必須', function () {
        $data = [];

        $request = new ShareLinkRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('book_shelf_id'))->toBeTrue();
    });

    test('本棚IDが整数でないとエラー', function () {
        $data = [
            'book_shelf_id' => 'abc',
        ];

        $request = new ShareLinkRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('book_shelf_id'))->toBeTrue();
    });

    test('存在しない本棚IDはエラー', function () {
        $data = [
            'book_shelf_id' => 99999,
        ];

        $request = new ShareLinkRequest();
        $validator = Validator::make($data, $request->rules());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->has('book_shelf_id'))->toBeTrue();
    });

    test('カスタムエラーメッセージが正しい', function () {
        $data = [
            'book_shelf_id' => 'invalid',
        ];

        $request = new ShareLinkRequest();
        $validator = Validator::make($data, $request->rules(), $request->messages());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->first('book_shelf_id'))->toBe('本棚IDは整数で入力してください。');
    });

    test('存在しない本棚のカスタムエラーメッセージ', function () {
        $data = [
            'book_shelf_id' => 99999,
        ];

        $request = new ShareLinkRequest();
        $validator = Validator::make($data, $request->rules(), $request->messages());

        expect($validator->fails())->toBeTrue();
        expect($validator->errors()->first('book_shelf_id'))->toBe('指定された本棚が存在しません。');
    });
});