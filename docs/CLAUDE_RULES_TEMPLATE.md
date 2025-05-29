# Claude Code プロジェクトルール テンプレート

このファイルはClaude Codeでプロジェクト固有のルールやガイドラインを設定するためのテンプレートです。
必要に応じてCLAUDE.mdに追加・統合してください。

## 📋 開発時の動作ルール

### コミット・プッシュ前の必須チェック
- [ ] テストが全て通ることを確認 (`vendor/bin/pest`)
- [ ] リンター・フォーマッターを実行 (`npm run lint`, `npm run format`)
- [ ] 型チェックが通ることを確認 (`npm run type-check`)
- [ ] N+1クエリ問題がないか確認
- [ ] セキュリティ脆弱性がないか確認

### ブランチ作成・作業開始時
- [ ] mainブランチから最新の状態でブランチを作成
- [ ] ブランチ名は規約に従う (`feature/`, `fix/`, `refactor/`, `optimize/`)
- [ ] Issueに紐づく場合は番号を含める

### プルリクエスト作成時
- [ ] タイトルとボディに適切な情報を記載
- [ ] テスト結果を含める
- [ ] 関連Issueをリンク
- [ ] 必要に応じてスクリーンショットを添付

## 🔧 技術的制約・ルール

### Laravel開発時の必須事項
```php
// ❌ 禁止パターン
// N+1クエリの発生
foreach ($users as $user) {
    $user->posts; // 各ユーザーごとにクエリ実行
}

// ループ内でのDB操作
foreach ($items as $item) {
    Model::create($item); // 各アイテムごとにINSERT
}

// ✅ 推奨パターン
// Eager Loading使用
$users = User::with('posts')->get();

// 一括操作
Model::insert($items);
```

### React/TypeScript開発時の必須事項
```typescript
// ❌ 禁止パターン
// any型の使用
const data: any = fetchData();

// propsの型定義なし
function Component(props) {
  return <div>{props.title}</div>;
}

// ✅ 推奨パターン
// 適切な型定義
interface ComponentProps {
  title: string;
  description?: string;
}

function Component({ title, description }: ComponentProps) {
  return (
    <div>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  );
}
```

## 📝 コードレビューチェックリスト

### 機能実装
- [ ] 要件を満たしている
- [ ] エッジケースが考慮されている
- [ ] エラーハンドリングが適切
- [ ] パフォーマンスが最適化されている

### コード品質
- [ ] 命名規則に従っている
- [ ] 重複コードがない
- [ ] 適切にコメントが記載されている
- [ ] テストがある

### セキュリティ
- [ ] 入力値の検証がある
- [ ] 認証・認可が適切
- [ ] SQLインジェクション対策済み
- [ ] XSS対策済み

## 🚨 緊急時・障害対応ルール

### 本番環境での問題発生時
1. 即座にSlack/チャットで報告
2. ログを確認・保存
3. 必要に応じてロールバック
4. 根本原因の調査・報告書作成

### ホットフィックス作成時
- ブランチ名: `hotfix/問題の説明`
- mainブランチから直接作成
- 最小限の変更に留める
- テストを必ず実行

## 📊 パフォーマンス基準

### ページ読み込み時間
- 初回読み込み: 3秒以内
- 2回目以降: 1秒以内

### データベースクエリ
- N+1クエリは禁止
- 1ページあたりのクエリ数: 10個以下が理想

### テスト実行時間
- 全テスト: 5分以内
- 単体テスト: 30秒以内

## 🎯 品質基準

### テストカバレッジ
- 全体: 80%以上
- 新規コード: 90%以上
- クリティカルパス: 100%

### コード品質メトリクス
- 関数の複雑度: 10以下
- クラスのメソッド数: 20以下
- ファイルの行数: 500行以下

## 🛠️ ツール設定

### 必須ツール
```bash
# PHP
composer install
vendor/bin/pest          # テスト実行
vendor/bin/phpstan       # 静的解析

# JavaScript/TypeScript
npm install
npm run lint             # ESLint
npm run type-check       # TypeScript
npm run test             # Jest/Vitest
```

### 推奨IDE設定
```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "php.validate.enable": true,
  "typescript.preferences.organizeImports": true
}
```

## 📚 参考ドキュメント

### プロジェクト内ドキュメント
- `docs/PERFORMANCE_OPTIMIZATION_GUIDE.md` - パフォーマンス最適化指針
- `docs/ISSUE_85_IMPLEMENTATION.md` - 実装例とベストプラクティス

### 外部リソース
- [Laravel公式ドキュメント](https://laravel.com/docs)
- [React公式ドキュメント](https://react.dev)
- [TypeScript公式ドキュメント](https://www.typescriptlang.org)

## 🎯 カスタマイズ項目

以下の項目は、プロジェクトの特性に応じてカスタマイズしてください：

### チーム固有のルール
```
ここにチーム固有のコーディング規約、
ワークフロー、ツール設定などを記載
```

### プロジェクト固有の制約
```
特定の技術的制約、ビジネスルール、
パフォーマンス要件などを記載
```

### 禁止事項
```
使用を禁止するライブラリ、パターン、
アプローチなどを明確に記載
```

### 推奨事項
```
積極的に使用すべきライブラリ、パターン、
ツールなどを記載
```

---

## 📖 CLAUDE.mdファイルの使い方

### 基本的な使い方
1. プロジェクトルートに`CLAUDE.md`ファイルを作成
2. プロジェクト固有のルールやガイドラインを記載
3. Claude Codeが自動的にファイルを読み込み、指示に従って動作

### ファイルインポート機能
```markdown
# メインのCLAUDE.md
@docs/coding-standards.md  # 外部ファイルをインポート
@docs/api-guidelines.md
```

### 記憶の追加
- 入力の最初に`#`をつけることで、記憶として追加可能
- 例: `# 新しいAPIエンドポイントを作成する際は、必ずバリデーションを実装する`

### 記憶の編集
```bash
/memory  # エディタでCLAUDE.mdを編集
```

この雛形を参考に、プロジェクトに特化したルールを設定してください。