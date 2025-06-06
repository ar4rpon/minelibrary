<?php

use App\Models\User;
use Illuminate\Support\Facades\Session;

test('パスワード確認画面が表示される', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/confirm-password');

    $response->assertStatus(200);
});

test('正しいパスワードで確認できる', function () {
    $user = User::factory()->create();
    
    Session::start();

    $response = $this->actingAs($user)
        ->withSession(['_token' => Session::token()])
        ->post('/confirm-password', [
            '_token' => Session::token(),
            'password' => 'password',
        ]);

    $response->assertRedirect();
    $response->assertSessionHasNoErrors();
});

test('間違ったパスワードでは確認できない', function () {
    $user = User::factory()->create();
    
    Session::start();

    $response = $this->actingAs($user)
        ->withSession(['_token' => Session::token()])
        ->post('/confirm-password', [
            '_token' => Session::token(),
            'password' => 'wrong-password',
        ]);

    $response->assertSessionHasErrors('password');
});
