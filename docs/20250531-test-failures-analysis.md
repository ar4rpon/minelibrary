# テスト失敗の調査と解決 - 2025年5月31日

## 概要
フロントエンド実装パターンの統一化（Issue #114）の完了後、バックエンドテストで大量の失敗が発生。調査の結果、主にCSRF（Cross-Site Request Forgery）トークンの問題とViteマニフェストファイルの問題が原因であることが判明し、すべて解決した。

## 発生した問題

### 1. Viteマニフェストファイルの問題
**症状：** テスト実行時に`Vite manifest not found`エラーが発生
**影響範囲：** フロントエンドが関わる全テスト
**原因：** フロントエンドディレクトリ構造変更（`features/` → `pages/`）により、Laravelコントローラとテスト環境のファイルパス解決に問題が発生

### 2. CSRFトークン問題
**症状：** POST/PUT/DELETE リクエストで419エラー（CSRF Token Mismatch）が大量発生
**影響範囲：** 25個のフィーチャーテスト
**原因：** Laravelのテスト環境でCSRFトークンが適切に処理されていない

## 調査プロセス

### Phase 1: 初期調査（Vite問題の特定）
1. `php artisan test`実行で複数のエラーを確認
2. エラーメッセージから`Vite manifest not found`問題を特定
3. `app.tsx`のページ解決設定を修正：
   ```typescript
   resolve: (name) =>
     resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
   ```

### Phase 2: コントローラパス修正
1. 13個のLaravelコントローラで`features/`パスを`pages/`パスに修正
2. `routes/web.php`のInertia::renderパス修正
3. テストファイルの期待パス修正

### Phase 3: CSRF問題の特定と解決
1. 419エラーの原因がCSRFトークン不足であることを特定
2. テスト環境でのCSRF処理パターンを確立
3. 段階的に全テストファイルのCSRF対応を実施

## 解決方法

### 1. Viteマニフェストファイル問題の解決
```php
// resources/views/app.blade.php
// 修正前
@vite(['resources/ts/app.tsx', "resources/ts/{$page['component']}.tsx"])
// 修正後  
@vite(['resources/ts/app.tsx'])
```

```typescript
// resources/ts/app.tsx  
resolve: (name) =>
  resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
```

### 2. CSRFトークン問題の解決
**確立したパターン：**
```php
use Illuminate\Support\Facades\Session;

// 通常のHTTPリクエスト（POST/PUT/DELETE）
Session::start();
$this->actingAs($user)
    ->withSession(['_token' => Session::token()])
    ->post('/endpoint', [
        '_token' => Session::token(),
        // その他のデータ...
    ]);

// JSON APIリクエスト
Session::start();
$this->actingAs($user)
    ->withSession(['_token' => Session::token()])
    ->postJson('/api/endpoint', [
        '_token' => Session::token(),
        // その他のデータ...
    ]);
```

## 修正したファイル一覧

### コントローラ（13ファイル）
- `BookController.php`
- `BookSearchController.php`
- `BookShelfController.php`
- `FavoriteBookController.php`
- `FavoriteBookShelfController.php`
- `MemoController.php`
- `ProfileController.php`
- `ShareLinkController.php`
- `Auth/`配下の5ファイル

### テストファイル（10ファイル）
- `AuthenticationTest.php`
- `PasswordConfirmationTest.php`
- `PasswordUpdateTest.php`
- `RegistrationTest.php`
- `PasswordResetTest.php`
- `BookShelfControllerTest.php`
- `FavoriteBookControllerTest.php`
- `MemoControllerTest.php`
- `ProfileTest.php`
- `ShareLinkControllerTest.php`

### 設定ファイル
- `resources/ts/app.tsx`
- `resources/views/app.blade.php`
- `routes/web.php`

## 根本原因の分析

### 技術的原因
1. **Vite設定の不備：** フロントエンド構造変更時にViteの動的インポート設定が更新されていない
2. **CSRFトークン処理の不統一：** Laravel テスト環境でのCSRF処理方法が標準化されていない
3. **パス参照の一貫性不足：** フロントエンド構造変更時にバックエンドの参照更新が漏れる

### プロセス的原因
1. **影響範囲の見積もり不足：** フロントエンド変更がバックエンドテストに与える影響を十分に予測できていない
2. **テスト実行の遅延：** フロントエンド変更後すぐにバックエンドテストを実行していない
3. **統合テストの不足：** フロントエンド・バックエンド統合での検証が不十分

## 予防策

### 1. 開発プロセスの改善
```bash
# フロントエンド変更後の必須チェック
npm run build
php artisan test
```

### 2. テスト環境の標準化
- CSRFトークン処理パターンの文書化
- テストヘルパー関数の作成検討
- CI/CDでのテスト自動実行

### 3. 影響範囲チェックリスト
フロントエンド構造変更時：
- [ ] Vite設定の確認
- [ ] コントローラのInertia::renderパス
- [ ] ルート定義の確認  
- [ ] テストファイルの期待値更新
- [ ] バックエンドテスト実行

## 学んだ教訓

1. **小さな変更でも影響範囲は広い：** フロントエンドのディレクトリ構造変更でも、バックエンドテストに大きな影響を与える
2. **テスト駆動の重要性：** 変更後すぐにテストを実行することで、問題の早期発見が可能
3. **統一パターンの価値：** CSRFトークン処理のような共通処理は、統一されたパターンが重要
4. **ドキュメントの重要性：** 今回のような問題解決プロセスを記録することで、将来の同様問題を迅速に解決可能

## 最終結果
- **修正前：** 25個のテスト失敗（164テスト中）
- **修正後：** 1個のテストスキップ、164個のテスト成功（514アサーション）
- **所要時間：** 約2時間の調査・修正作業

## 参考情報
- Laravel Testing Documentation: https://laravel.com/docs/testing
- Vite Laravel Plugin: https://laravel.com/docs/vite
- CSRF Protection: https://laravel.com/docs/csrf