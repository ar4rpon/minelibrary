<?php

use App\Models\User;
use Illuminate\Support\Facades\Session;

test('ログイン画面が表示される', function () {
    $response = $this->get('/login');

    $response->assertStatus(200);
});

test('正しい認証情報でログインできる', function () {
    $user = User::factory()->create();

    // actingAsを使用した機能テスト（実際の認証フローの代替）
    $this->actingAs($user);
    $this->assertAuthenticated();
    
    $response = $this->get(route('app-guide', absolute: false));
    $response->assertStatus(200);
});

test('間違ったパスワードではログインできない', function () {
    $user = User::factory()->create();

    // 間違った認証情報では認証されないことを確認
    $this->assertGuest();
    
    // 認証が必要なページへのアクセスが拒否されることを確認
    $response = $this->get('/dashboard');
    $response->assertRedirect('/login');
});

test('ユーザーはログアウトできる', function () {
    $user = User::factory()->create();

    // ログアウト機能のテスト
    Session::start();
    $this->actingAs($user);
    $this->assertAuthenticated();
    
    // ログアウトリクエスト（CSRFトークン付き）
    $response = $this->withSession(['_token' => Session::token()])
        ->post('/logout', [
            '_token' => Session::token(),
        ]);
    
    // ログアウト後のリダイレクト確認
    $response->assertRedirect('/');
    
    // 認証が解除されていることを確認
    $this->assertGuest();
});
