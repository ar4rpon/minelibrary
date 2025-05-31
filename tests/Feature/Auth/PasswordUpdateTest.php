<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;

test('パスワードを更新できる', function () {
    $user = User::factory()->create();
    
    Session::start();

    $response = $this
        ->actingAs($user)
        ->withSession(['_token' => Session::token()])
        ->from('/profile')
        ->put('/password', [
            '_token' => Session::token(),
            'current_password' => 'password',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/profile');

    $this->assertTrue(Hash::check('new-password', $user->refresh()->password));
});

test('パスワード更新には正しい現在のパスワードが必要', function () {
    $user = User::factory()->create();
    
    Session::start();

    $response = $this
        ->actingAs($user)
        ->withSession(['_token' => Session::token()])
        ->from('/profile')
        ->put('/password', [
            '_token' => Session::token(),
            'current_password' => 'wrong-password',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]);

    $response
        ->assertSessionHasErrors('current_password')
        ->assertRedirect('/profile');
});
