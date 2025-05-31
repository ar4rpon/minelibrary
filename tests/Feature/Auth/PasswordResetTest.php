<?php

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Session;

test('パスワードリセットリンク画面が表示される', function () {
    $response = $this->get('/forgot-password');

    $response->assertStatus(200);
});

test('パスワードリセットリンクを要求できる', function () {
    Notification::fake();
    Session::start();

    $user = User::factory()->create();

    $this->withSession(['_token' => Session::token()])
        ->post('/forgot-password', [
            '_token' => Session::token(),
            'email' => $user->email
        ]);

    Notification::assertSentTo($user, ResetPassword::class);
});

test('パスワードリセット画面が表示される', function () {
    Notification::fake();
    Session::start();

    $user = User::factory()->create();

    $this->withSession(['_token' => Session::token()])
        ->post('/forgot-password', [
            '_token' => Session::token(),
            'email' => $user->email
        ]);

    Notification::assertSentTo($user, ResetPassword::class, function ($notification) {
        $response = $this->get('/reset-password/'.$notification->token);

        $response->assertStatus(200);

        return true;
    });
});

test('有効なトークンでパスワードをリセットできる', function () {
    Notification::fake();
    Session::start();

    $user = User::factory()->create();

    $this->withSession(['_token' => Session::token()])
        ->post('/forgot-password', [
            '_token' => Session::token(),
            'email' => $user->email
        ]);

    Notification::assertSentTo($user, ResetPassword::class, function ($notification) use ($user) {
        Session::start();
        $response = $this->withSession(['_token' => Session::token()])
            ->post('/reset-password', [
                '_token' => Session::token(),
                'token' => $notification->token,
                'email' => $user->email,
                'password' => 'password',
                'password_confirmation' => 'password',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('login'));

        return true;
    });
});
