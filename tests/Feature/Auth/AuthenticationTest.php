<?php

use App\Models\User;

test('ログイン画面が表示される', function () {
    $response = $this->get('/login');

    $response->assertStatus(200);
});

test('正しい認証情報でログインできる', function () {
    $user = User::factory()->create();

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('app-guide', absolute: false));
});

test('間違ったパスワードではログインできない', function () {
    $user = User::factory()->create();

    $this->post('/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
});

test('ユーザーはログアウトできる', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/logout');

    $this->assertGuest();
    $response->assertRedirect('/');
});
