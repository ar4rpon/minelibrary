<?php

it('ルートページが正常に表示される', function () {
    $response = $this->get('/');

    $response->assertStatus(200);
});
