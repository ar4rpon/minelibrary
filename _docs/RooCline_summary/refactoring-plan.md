# BookCardUIリファクタリング計画

現在の`BookCard.tsx`を分析した結果、以下の問題点が見つかりました：

## 現状の問題点

1. **APIコールとUIの混在**

    - 一部のAPIコールは直接コンポーネント内で`axios`を使用
    - 一部のAPIコールは`BookService`を使用
    - 一貫性がなく、メンテナンスが難しい状態

2. **UIのバリエーション処理が複雑**

    - `variant`プロパティによる条件分岐が多数あり、コードの可読性が低下
    - 共通部分と可変部分の分離が不十分

3. **状態管理が複雑**
    - 多数の`useState`が使われており、関連する状態の管理が分散

## リファクタリング計画

### 1. ディレクトリ構造の整理

```
resources/ts/Components/Book/
├── BookCard/
│   ├── index.tsx                 # エントリーポイント
│   ├── BaseBookCard.tsx          # 基本となる共通コンポーネント
│   ├── DefaultBookCard.tsx       # デフォルトバリアント
│   ├── FavoriteBookCard.tsx      # お気に入りバリアント
│   ├── BookShelfBookCard.tsx     # 本棚バリアント
│   ├── BookCardImage.tsx         # 書籍画像コンポーネント
│   ├── BookCardHeader.tsx        # 書籍タイトル・情報コンポーネント
│   └── hooks/
│       ├── useBookCardState.ts   # 共通の状態管理
│       ├── useFavoriteBook.ts    # お気に入り関連の状態と処理
│       ├── useBookShelf.ts       # 本棚関連の状態と処理
│       └── useBookMemo.ts        # メモ関連の状態と処理
```

### 2. APIコールの整理

`bookService.ts`を拡張して、現在`BookCard.tsx`内にある全てのAPIコールを移動します。

```typescript
// bookService.ts の拡張
export const BookService = {
    // 既存のメソッド...

    // 新しく追加するメソッド
    createMemo: (data: {
        isbn: string;
        memo: string;
        memo_chapter?: number;
        memo_page?: number;
    }) => axios.post('/memo/create', data),

    // その他必要なメソッド...
};
```

### 3. コンポーネントの分割

#### BaseBookCard.tsx

- 基本的なカードレイアウトと共通のプロパティを持つ
- 子コンポーネントをスロットとして受け取る設計

#### バリアント別コンポーネント

- それぞれのバリアント（Default, Favorite, BookShelf）に特化したコンポーネント
- 共通の`BaseBookCard`を使用し、特有のUIと機能を追加

#### 共通UIコンポーネント

- `BookCardImage`：書籍の画像表示を担当
- `BookCardHeader`：タイトルと基本情報の表示を担当

### 4. カスタムフックによる状態管理

#### useBookCardState.ts

- ダイアログの開閉状態など、共通の状態を管理

#### useFavoriteBook.ts

- お気に入り状態の取得と更新を管理

#### useBookShelf.ts

- 本棚関連の状態と処理を管理

#### useBookMemo.ts

- メモ関連の状態と処理を管理

### 5. 型定義の改善

```typescript
// 共通の書籍プロパティ
export interface BookBaseProps {
    isbn: string;
    title: string;
    author: string;
    publisher_name: string;
    sales_date: string;
    item_price: number;
    image_url: string;
    item_caption: string;
}

// バリアント別のプロパティ
export interface DefaultBookCardProps extends BookBaseProps {}

export interface FavoriteBookCardProps extends BookBaseProps {
    readStatus: ReadStatus;
}

export interface BookShelfBookCardProps extends BookBaseProps {
    readStatus: ReadStatus;
    book_shelf_id: number;
}
```

## 実装手順

1. まず`bookService.ts`を拡張して、全てのAPIコールを移動
2. 基本となる`BaseBookCard`コンポーネントを作成
3. 共通UIコンポーネント（`BookCardImage`、`BookCardHeader`）を作成
4. カスタムフックを実装して状態管理を分離
5. バリアント別コンポーネントを実装
6. エントリーポイントとなる`index.tsx`を作成して、適切なバリアントを選択するロジックを実装

## 期待される効果

1. **コードの可読性向上**

    - 責務が明確に分離され、各ファイルの役割が明確になる
    - ファイルサイズが小さくなり、理解しやすくなる

2. **メンテナンス性の向上**

    - APIの変更があった場合、`bookService.ts`のみを修正すれば良い
    - UIの変更があった場合、関連するコンポーネントのみを修正すれば良い

3. **再利用性の向上**

    - 共通コンポーネントを他の場所でも使用できる
    - カスタムフックを他のコンポーネントでも使用できる

4. **テスト容易性の向上**
    - 小さなコンポーネントとフックは単体テストが容易
    - モックが必要な部分（API呼び出し）が明確に分離される
