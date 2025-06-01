<?php

use App\Models\User;
use Illuminate\Support\Facades\Session;

test('プロフィールページが表示される', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get('/profile');

    $response->assertOk();
});

test('プロフィール情報を更新できる', function () {
    $user = User::factory()->create();

    Session::start();
    $response = $this
        ->actingAs($user)
        ->withSession(['_token' => Session::token()])
        ->patch('/api/profile', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            '_token' => Session::token(),
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/profile/edit');

    $user->refresh();

    $this->assertSame('Test User', $user->name);
    $this->assertSame('test@example.com', $user->email);
    $this->assertNull($user->email_verified_at);
});

test('メールアドレスが変更されない場合メール認証状態は保持される', function () {
    $user = User::factory()->create();

    Session::start();
    $response = $this
        ->actingAs($user)
        ->withSession(['_token' => Session::token()])
        ->patch('/api/profile', [
            'name' => 'Test User',
            'email' => $user->email,
            '_token' => Session::token(),
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/profile/edit');

    $this->assertNotNull($user->refresh()->email_verified_at);
});

test('ユーザーはアカウントを削除できる', function () {
    $user = User::factory()->create();

    Session::start();
    $response = $this
        ->actingAs($user)
        ->withSession(['_token' => Session::token()])
        ->delete('/api/profile', [
            'password' => 'password',
            '_token' => Session::token(),
        ]);

    $response->assertRedirect('/');

    $this->assertGuest();
    $this->assertNull($user->fresh());
});

test('アカウント削除には正しいパスワードが必要', function () {
    $user = User::factory()->create();

    Session::start();
    $response = $this
        ->actingAs($user)
        ->from('/profile')
        ->withSession(['_token' => Session::token()])
        ->delete('/api/profile', [
            'password' => 'wrong-password',
            '_token' => Session::token(),
        ]);

    $response
        ->assertSessionHasErrors('password')
        ->assertRedirect('/profile');

    $this->assertNotNull($user->fresh());
});
