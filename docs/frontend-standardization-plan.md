# フロントエンド実装統一化計画

## 完了済み（Phase 1-2）

### Phase 1: コンポーネント構造統一 ✅
- [x] コンポーネントのexport/import パターン統一
  - named exportを優先、後方互換性でdefault exportも提供
- [x] Props型定義の一貫性確保
  - ベース型からの継承パターンを統一
  - 拡張プロパティの記述方法を標準化
- [x] React.memoの適切な使用基準設定
  - 使用基準を文書化（`docs/frontend-memo-usage-standard.md`）
  - 不要なmemoを削除

### Phase 2: フック実装統一 ✅
- [x] エラーハンドリングパターンの統一
  - 全フックでuseAsyncState + ApiErrorHandlerに統一
  - console.errorによる直接ログ出力を削除
- [x] API統合方法の一貫性確保
  - MemoServiceを新規作成
  - 直接axios呼び出しからServiceクラス経由に変更

## 未完了（今後の作業）

### Phase 3: 型定義統一
- [ ] 命名規則の統一（API型とドメイン型の分離）
  - `BookData` (API) vs `BookProps` (UI) の使い分け統一
  - snake_case (API) vs camelCase (Domain) の一貫性確保
- [ ] interfaceとtypeの使い分け基準
  - オブジェクト型: interface
  - Union型・プリミティブ: type
- [ ] プロパティ命名の一貫性
  - `publisher_name` vs `publisher` の統一
  - `sales_date` vs `published_date` の統一

### Phase 4: インポート/エクスポート統一
- [ ] インポート順序の標準化
  ```typescript
  // 1. React and external libraries
  // 2. Internal API/services  
  // 3. UI components
  // 4. Domain components
  // 5. Types
  // 6. Local/relative imports
  ```
- [ ] バレルエクスポートパターンの統一
  - `index.ts`ファイルでの一貫したエクスポート方法

## 実装効果

### 改善されたパターン
1. **統一されたエラーハンドリング**: useAsyncState + ApiErrorHandler
2. **一貫したコンポーネント構造**: named export + Props interface
3. **明確なReact.memo使用基準**: パフォーマンス向上が期待できる場合のみ適用

### 開発体験の向上
- コードの可読性向上
- 実装パターンの予測可能性
- エラーハンドリングの一貫性
- メンテナンスコストの削減

## 次回作業時の注意点
- CLAUDE.mdのDevelopment Flowに従う
- 各Phaseごとにコミットを分ける
- 既存コンポーネントへの影響を最小限に抑える
- テストの実行を忘れない