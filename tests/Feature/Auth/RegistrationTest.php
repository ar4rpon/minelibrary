<?php

test('ユーザー登録画面が表示される', function () {
    $response = $this->get('/register');

    $response->assertStatus(200);
});

test('新しいユーザーが登録できる', function () {
    $response = $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('app-guide', absolute: false));
});
