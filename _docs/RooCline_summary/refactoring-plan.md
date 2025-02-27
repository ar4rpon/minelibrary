# 本棚コンポーネントリファクタリング計画

## 現状の分析

### 良い点

1. **コンポーネントの分割**: BaseBookShelfCard、DefaultBookShelfCard、BookShelfDescriptionCardなど、役割ごとにコンポーネントが分割されている
2. **カスタムフックの使用**: useBookShelfStateでダイアログの状態管理を行っている
3. **型定義の整備**: bookShelf.tsで型定義が整理されている

### 改善点

1. **関心の分離が不十分**:

    - UIコンポーネントにビジネスロジックが混在している
    - ダイアログの状態管理とAPIリクエストが密結合している

2. **ディレクトリ構造の問題**:

    - 機能とUIの分離が不明確
    - 関連するコンポーネントが散在している（DialogとComponentsの分離など）

3. **再利用性の低さ**:
    - コンポーネント間の依存関係が強い
    - 共通の処理が複数の場所に重複している

## リファクタリング計画

### 1. ディレクトリ構造の再編成

```
resources/ts/
├── components/                  # 純粋なUIコンポーネント
│   ├── ui/                      # 基本UIコンポーネント
│   ├── book/                    # 書籍関連のUIコンポーネント
│   └── bookshelf/               # 本棚関連のUIコンポーネント
│       ├── card/                # カード関連のコンポーネント
│       │   ├── BaseCard.tsx     # 基本カードコンポーネント
│       │   ├── DefaultCard.tsx  # デフォルトカード
│       │   └── DetailCard.tsx   # 詳細カード
│       ├── elements/            # カードの構成要素
│       │   ├── Header.tsx       # ヘッダー
│       │   ├── Image.tsx        # 画像
│       │   └── UserInfo.tsx     # ユーザー情報
│       └── index.tsx            # エントリーポイント
├── features/                    # 機能単位のコンテナコンポーネント
│   ├── book/                    # 書籍機能
│   └── bookshelf/               # 本棚機能
│       ├── components/          # 本棚機能固有のコンポーネント
│       │   └── dialogs/         # ダイアログコンポーネント
│       ├── hooks/               # 本棚機能のカスタムフック
│       └── pages/               # 本棚機能のページコンポーネント
├── services/                    # APIサービス
├── hooks/                       # 共通カスタムフック
└── types/                       # 型定義
```

### 2. 関心の分離

#### UIコンポーネント（Presentational Components）

- 見た目のみに責任を持つ
- propsを通じてデータと振る舞いを受け取る
- 状態管理やAPIリクエストを行わない

#### 機能コンポーネント（Container Components）

- 状態管理とロジックに責任を持つ
- UIコンポーネントにデータと振る舞いを提供する
- APIリクエストやイベントハンドリングを行う

#### サービス

- APIリクエストなどの外部通信に責任を持つ
- ビジネスロジックを含まない
- 再利用可能なAPIクライアント

#### カスタムフック

- 再利用可能なロジックをカプセル化する
- 状態管理や副作用を扱う
- UIから独立している

## 実行手順

### ステップ1: ディレクトリ構造の再編成

1. 新しいディレクトリ構造を作成する
2. 既存のファイルを適切な場所に移動する
3. インポートパスを更新する

### ステップ2: UIコンポーネントのリファクタリング

1. BookShelfCardコンポーネントをUIと機能に分離する

    - `BaseCard.tsx`、`DefaultCard.tsx`、`DetailCard.tsx`に分割
    - propsインターフェースを整理する

2. 共通要素を抽出する
    - `Header.tsx`、`Image.tsx`、`UserInfo.tsx`などに分割

### ステップ3: 機能コンポーネントの作成

1. ダイアログ関連のコンポーネントを整理する

    - `features/bookshelf/components/dialogs/`に移動

2. カスタムフックを整理する
    - `useBookShelfState`を`features/bookshelf/hooks/`に移動
    - 必要に応じて機能を分割する

### ステップ4: サービスの整理

1. APIリクエスト関連のコードを整理する
    - `services/bookShelfService.ts`を改善
    - エラーハンドリングを強化

### ステップ5: 型定義の整理

1. 型定義を整理する
    - `types/bookShelf.ts`を改善
    - 必要に応じて型を分割
