<?php

use Illuminate\Support\Facades\Session;

test('ユーザー登録画面が表示される', function () {
    $response = $this->get('/register');

    $response->assertStatus(200);
});

test('新しいユーザーが登録できる', function () {
    Session::start();
    
    $response = $this->withSession(['_token' => Session::token()])
        ->post('/register', [
            '_token' => Session::token(),
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('app-guide', absolute: false));
});
