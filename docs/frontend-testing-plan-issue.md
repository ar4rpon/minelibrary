# フロントエンドテスト計画とテストフレームワーク導入

## 問題の背景

現在、minelibraryプロジェクトではバックエンドのテスト（Pest）は165テストが通過していますが、フロントエンド（React/TypeScript）のテストが全く存在せず、UIでの実際の操作時に以下の問題が発生しています：

### 確認された問題
- book/searchページでAPIエラー（Unauthenticated）が発生
- CSRFトークンの設定不備（修正済み）
- フロントエンドコンポーネントの動作検証ができない
- APIクライアントの認証処理のテストが不十分

## 目標

### Phase 1: 基盤構築（高優先度）
1. **フロントエンドテストフレームワークの導入**
2. **基本的なコンポーネントテストの実装**
3. **API統合テストの実装**
4. **E2Eテストの基盤構築**

### Phase 2: 包括的テスト（中優先度）
1. **全ページのUIテスト**
2. **ユーザーフローのE2Eテスト**
3. **アクセシビリティテスト**
4. **パフォーマンステスト**

## 具体的な実装計画

### 1. テストフレームワークの導入

#### 必要なパッケージ
```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "vitest": "^1.0.0",
    "@vitest/ui": "^1.0.0",
    "jsdom": "^23.0.0",
    "msw": "^2.0.0",
    "playwright": "^1.40.0",
    "@playwright/test": "^1.40.0"
  }
}
```

#### テスト設定ファイル
- `vitest.config.ts` - ユニット・統合テスト設定
- `playwright.config.ts` - E2Eテスト設定
- `setupTests.ts` - テスト環境初期化

### 2. テストカテゴリの定義

#### A. コンポーネントテスト（Vitest + React Testing Library）
**対象コンポーネント（優先順位順）：**

1. **認証関連（最高優先度）**
   - `Login.tsx`
   - `Register.tsx`
   - `Navigation.tsx`

2. **書籍機能（高優先度）**
   - `SearchBook.tsx`
   - `BookCard.tsx` / `DefaultCard.tsx`
   - `FavoriteBookList.tsx`

3. **本棚機能（高優先度）**
   - `BookShelfList.tsx`
   - `BookShelfDetail.tsx`
   - `CreateBookShelfDialog.tsx`

4. **メモ機能（中優先度）**
   - `MemoList.tsx`
   - `MemoCard.tsx`
   - `CreateMemoDialog.tsx`

5. **共通コンポーネント（中優先度）**
   - `BaseCard.tsx`
   - `CommonPagination.tsx`
   - `DefaultLayout.tsx`

#### B. フック/ユーティリティテスト
**対象フック（優先順位順）：**

1. **API関連フック（最高優先度）**
   - `useFavoriteBook.ts`
   - `useBook.ts`
   - `useBookShelf.ts`
   - `useMemo.ts`

2. **共通フック（中優先度）**
   - `useDialogState.ts`
   - `useAsyncState.ts`

3. **サービスクラス（高優先度）**
   - `BookService`
   - `BookShelfService`
   - `MemoService`

#### C. 統合テスト（API + UI）
**対象シナリオ：**

1. **認証フロー**
   - ログイン/ログアウト
   - ユーザー登録
   - パスワードリセット

2. **書籍検索・お気に入り**
   - 書籍検索実行
   - お気に入り登録/解除
   - 読書状態更新

3. **本棚操作**
   - 本棚作成/編集/削除
   - 本棚への書籍追加/削除
   - 本棚共有リンク生成

4. **メモ機能**
   - メモ作成/編集/削除
   - 書籍とメモの関連付け

#### D. E2Eテスト（Playwright）
**対象ユーザーフロー：**

1. **新規ユーザー登録から書籍検索まで**
2. **ログインから本棚作成、書籍追加まで**
3. **お気に入り機能の利用フロー**
4. **メモ作成から共有まで**

### 3. テスト実装の優先順位

#### 第1段階（緊急）
- [ ] Vitestの導入と設定
- [ ] MSWによるAPIモック設定
- [ ] `useFavoriteBook`フックのテスト
- [ ] `DefaultCard`コンポーネントのテスト
- [ ] CSRFトークン関連のテスト

#### 第2段階（1週間以内）
- [ ] 認証フローのテスト
- [ ] 書籍検索機能のテスト
- [ ] API統合テストの基盤構築
- [ ] Playwrightの導入

#### 第3段階（2週間以内）
- [ ] 全主要コンポーネントのテスト
- [ ] E2Eテストスイートの完成
- [ ] CI/CDパイプラインへの統合

#### 第4段階（1ヶ月以内）
- [ ] アクセシビリティテスト
- [ ] パフォーマンステスト
- [ ] ビジュアルリグレッションテスト

### 4. テストの品質目標

#### カバレッジ目標
- **コンポーネント**: 80%以上
- **フック**: 90%以上
- **サービスクラス**: 85%以上
- **ユーティリティ**: 95%以上

#### テスト品質指標
- **E2Eテスト成功率**: 95%以上
- **テスト実行時間**: 5分以内（ユニット + 統合）
- **E2Eテスト実行時間**: 10分以内

### 5. CI/CD統合

#### GitHub Actions設定
```yaml
name: Frontend Tests
on: [push, pull_request]

jobs:
  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - name: Unit & Integration Tests
        run: |
          npm run test:unit
          npm run test:integration
          
      - name: E2E Tests
        run: |
          npm run test:e2e
          
      - name: Test Coverage
        run: |
          npm run test:coverage
```

### 6. 具体的な修正が必要な箇所

#### 既知の問題（修正済み）
- [x] `app.blade.php`のCSRFトークン設定
- [x] APIクライアントの`withCredentials`設定

#### 今後必要な修正
- [ ] エラーハンドリングの統一化
- [ ] API呼び出しタイミングの最適化
- [ ] 認証状態の適切な管理
- [ ] ローディング状態の改善

### 7. リソースと工数

#### 推定工数
- **フレームワーク導入**: 2日
- **基本テスト実装**: 1週間
- **包括的テスト**: 2週間
- **E2Eテスト**: 1週間

#### 必要なリソース
- **フロントエンド開発者**: 1名（メイン）
- **テスト支援**: 1名（サポート）
- **レビュアー**: 1名

## 成功の定義

### 短期目標（1週間）
- [ ] Vitestによる基本テストが動作
- [ ] 主要コンポーネント（5個）のテストが完了
- [ ] 認証エラーの再発防止

### 中期目標（1ヶ月）
- [ ] 全主要機能のテストカバレッジ80%達成
- [ ] E2Eテストスイートの完成
- [ ] CI/CDパイプラインでの自動テスト実行

### 長期目標（3ヶ月）
- [ ] フロントエンド品質の大幅向上
- [ ] バグの早期発見・修正の仕組み確立
- [ ] 開発速度の向上（リグレッション防止）

## 関連Issue

このissueは以下の技術的負債と関連しています：
- UI操作時の認証エラー（修正済み）
- フロントエンドの品質担保体制不足
- テストの自動化不足

## 備考

このテスト計画の実装により、フロントエンドの品質向上と開発効率の大幅な改善が期待されます。特に、現在のAPI認証エラーのような問題の早期発見と予防が可能になります。