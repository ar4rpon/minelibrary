# テストガイド

## 概要
このドキュメントは、minelibraryプロジェクトのテスト戦略とガイドラインを定義します。

## テストピラミッド

### 1. ユニットテスト（Unit Tests）
- **目的**: 個々のメソッドやクラスの動作を検証
- **対象**: モデル、ヘルパー関数、サービスクラス
- **実行時間**: < 1秒/テスト
- **カバレッジ目標**: 80%以上

### 2. フィーチャーテスト（Feature Tests）
- **目的**: APIエンドポイントや機能全体の動作を検証
- **対象**: コントローラー、ミドルウェア、認証フロー
- **実行時間**: < 5秒/テスト
- **カバレッジ目標**: 70%以上

### 3. 統合テスト（Integration Tests）
- **目的**: 外部サービスとの連携を検証
- **対象**: 楽天API連携、メール送信
- **実行時間**: < 10秒/テスト
- **カバレッジ目標**: 60%以上

## テスト実行方法

### 全テストの実行
```bash
php artisan test
```

### 特定のテストファイルの実行
```bash
php artisan test tests/Feature/BookShelfControllerTest.php
```

### カバレッジレポートの生成
```bash
php artisan test --coverage
```

### 並列実行（高速化）
```bash
php artisan test --parallel
```

## テストの書き方

### 基本構造（Pest）
```php
<?php

use App\Models\User;
use App\Models\BookShelf;

beforeEach(function () {
    // 各テスト前の準備
    $this->user = User::factory()->create();
});

test('ユーザーは本棚を作成できる', function () {
    $this->actingAs($this->user)
        ->post('/api/bookshelves', [
            'book_shelf_name' => 'お気に入りの本',
            'description' => '私のお気に入りの本のコレクション',
        ])
        ->assertStatus(201)
        ->assertJson([
            'book_shelf_name' => 'お気に入りの本',
        ]);
    
    $this->assertDatabaseHas('book_shelves', [
        'user_id' => $this->user->id,
        'book_shelf_name' => 'お気に入りの本',
    ]);
});
```

### 命名規則
- テストファイル: `{対象クラス}Test.php`
- テストメソッド: 日本語で何をテストするか明確に記述
- データプロバイダー: `provide{データの説明}`

### アサーション
```php
// ステータスコード
->assertStatus(200)
->assertCreated()
->assertNotFound()

// JSONレスポンス
->assertJson(['key' => 'value'])
->assertJsonStructure(['id', 'name'])

// データベース
$this->assertDatabaseHas('table', ['column' => 'value'])
$this->assertDatabaseMissing('table', ['column' => 'value'])

// 認証
$this->assertAuthenticated()
$this->assertGuest()
```

## テストデータの準備

### ファクトリーの使用
```php
// 単一のモデル作成
$user = User::factory()->create();

// 複数のモデル作成
$books = Book::factory()->count(5)->create();

// リレーション付きモデル
$bookShelf = BookShelf::factory()
    ->for($user)
    ->hasBooks(3)
    ->create();
```

### テスト用シーダー
```php
// 特定のテスト用データセット
$this->seed(TestBookSeeder::class);
```

## ベストプラクティス

### 1. AAA パターン
```php
test('本棚に本を追加できる', function () {
    // Arrange（準備）
    $bookShelf = BookShelf::factory()->create();
    $book = Book::factory()->create();
    
    // Act（実行）
    $response = $this->post("/api/bookshelves/{$bookShelf->id}/books", [
        'isbn' => $book->isbn,
    ]);
    
    // Assert（検証）
    $response->assertStatus(200);
    $this->assertTrue($bookShelf->books->contains($book));
});
```

### 2. テストの独立性
- 各テストは他のテストに依存しない
- テスト順序に関係なく実行可能
- グローバル状態を変更しない

### 3. テストデータ
- 意味のあるテストデータを使用
- マジックナンバーを避ける
- ファクトリーを活用

### 4. モックとスタブ
```php
// 外部APIのモック
Http::fake([
    'api.example.com/*' => Http::response(['result' => 'success'], 200),
]);

// サービスのモック
$this->mock(BookService::class, function ($mock) {
    $mock->shouldReceive('search')
        ->once()
        ->andReturn(collect([]));
});
```

## トラブルシューティング

### よくある問題

1. **テストが遅い**
   - `RefreshDatabase`の代わりに`DatabaseTransactions`を使用
   - 不要なファクトリーの作成を避ける
   - 並列実行を有効化

2. **テストが不安定**
   - 時間依存のテストには`Carbon::setTestNow()`を使用
   - ランダムな値には固定シードを使用
   - 外部APIは必ずモック化

3. **メモリ不足**
   - 大量のデータ作成を避ける
   - `tearDown`でリソースを解放
   - メモリリークをチェック

## CI/CD連携

### GitHub Actions設定
```yaml
- name: Run Tests
  run: |
    php artisan test --parallel
    php artisan test --coverage --min=60
```

## テストカバレッジ目標

### 現在の目標（Phase 1）
- 全体: 60%以上
- コントローラー: 70%以上
- モデル: 80%以上

### 最終目標（Phase 2）
- 全体: 80%以上
- コントローラー: 85%以上
- モデル: 90%以上

## 参考リンク
- [Pest公式ドキュメント](https://pestphp.com/)
- [Laravel Testing](https://laravel.com/docs/testing)
- [PHPUnit Assertions](https://docs.phpunit.de/en/10.5/assertions.html)