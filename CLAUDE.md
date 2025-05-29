# Claude Project Rules

## プロジェクト概要
このプロジェクトは、本の管理と共有を行うWebアプリケーション「minelibrary」です。
Laravel 11とReact（Inertia.js）を使用して構築されています。

## 技術スタック
- **バックエンド**: Laravel 11
- **フロントエンド**: React with TypeScript, Inertia.js
- **データベース**: SQLite
- **スタイリング**: Tailwind CSS
- **コンポーネント**: shadcn/ui

## コーディング規約

### Laravel (PHP)
1. **命名規則**
   - クラス名: PascalCase (例: `BookShelfController`)
   - メソッド名: camelCase (例: `getBooks`)
   - 変数名: camelCase (例: `$bookShelf`)
   - データベーステーブル名: snake_case、複数形 (例: `book_shelves`)
   - カラム名: snake_case (例: `book_shelf_name`)

2. **N+1クエリ問題の防止**
   - Eager Loadingを積極的に使用する (`with()`, `load()`)
   - `withCount()`を使用してカウントクエリを最適化
   - 複数のレコードに対する処理では、事前に必要なデータを一括取得

3. **コントローラー**
   - 1つのコントローラーは1つのリソースに対応
   - RESTfulな設計を心がける
   - ビジネスロジックはモデルやサービスクラスに移動

### React/TypeScript
1. **命名規則**
   - コンポーネント: PascalCase (例: `BookShelfList`)
   - 関数・変数: camelCase (例: `handleSubmit`)
   - 型定義: PascalCase (例: `BookShelfType`)
   - ファイル名: コンポーネントはPascalCase、それ以外はkebab-case

2. **コンポーネント設計**
   - 関数コンポーネントを使用
   - TypeScriptの型定義を必ず行う
   - PropsはinterfaceまたはtypeAliasで定義

3. **ディレクトリ構造**
   ```
   resources/js/
   ├── components/     # 共通コンポーネント
   ├── features/       # 機能別のコンポーネント
   ├── hooks/          # カスタムフック
   ├── layouts/        # レイアウトコンポーネント
   ├── pages/          # ページコンポーネント
   └── types/          # 型定義
   ```

## 開発ワークフロー

1. **ブランチ戦略**
   - mainブランチが本番環境
   - 機能開発: `feature/機能名#issue番号`
   - バグ修正: `fix/問題の説明#issue番号`
   - リファクタリング: `refactor/対象#issue番号`

2. **コミットメッセージ**
   - 日本語で記述
   - プレフィックスを使用: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`
   - 例: `feat: 本棚のお気に入り機能を追加`

3. **プルリクエスト**
   - タイトルにIssue番号を含める
   - 変更内容を明確に記述
   - テストが通ることを確認

## テストとビルド

### テストコマンド
```bash
# PHPUnit テスト（Pest）
php artisan test

# 特定のテストファイルを実行
php artisan test tests/Feature/BookShelfControllerTest.php

# カバレッジレポート付きテスト
php artisan test --coverage

# 並列実行（高速化）
php artisan test --parallel

# JavaScript リンティング
npm run lint
```

### ビルドコマンド
```bash
# 開発環境
npm run dev

# 本番環境
npm run build
```

### テストガイドライン
1. **テスト作成のルール**
   - 新機能追加時は必ずテストを作成
   - バグ修正時は再発防止のためのテストを追加
   - テストはAAA（Arrange-Act-Assert）パターンに従う

2. **テストの種類**
   - ユニットテスト: モデルやサービスクラスの個別メソッド
   - フィーチャーテスト: APIエンドポイントや統合的な機能
   - 詳細は`TESTING.md`を参照

3. **カバレッジ目標**
   - 初期目標: 60%以上
   - 最終目標: 80%以上

## パフォーマンス最適化

1. **データベースクエリ**
   - N+1問題を避ける
   - 適切なインデックスを設定
   - 不要なデータは取得しない（select()を使用）

2. **フロントエンド**
   - 画像の遅延読み込み
   - コンポーネントの適切なメモ化
   - 不要な再レンダリングを避ける

## セキュリティ

1. **認証・認可**
   - すべてのルートに適切な認証を設定
   - ユーザーの権限を確認してからデータアクセス
   - CSRF保護を有効化

2. **データ検証**
   - フロントエンドとバックエンドの両方で検証
   - SQLインジェクション対策（Eloquent ORMを使用）
   - XSS対策（Bladeテンプレートのエスケープ機能を使用）

## その他の注意事項

1. **環境変数**
   - 本番環境の設定は`.env`ファイルで管理
   - シークレット情報はコミットしない

2. **ログ**
   - エラーは適切にログに記録
   - デバッグ情報は開発環境のみ

3. **コメント**
   - 複雑なロジックには必ずコメントを追加
   - ただし、コードが自己文書化されている場合は不要