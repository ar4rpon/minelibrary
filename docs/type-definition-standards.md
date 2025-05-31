# 型定義標準化ガイドライン

## 基本方針

### 1. interface vs type の使い分け

#### interface を使用する場合
- **オブジェクト型の定義**
- **拡張可能性が必要**
- **APIレスポンス・リクエストの型定義**

```typescript
// ✅ Good - オブジェクト型にはinterface
export interface BookData {
  isbn: string;
  title: string;
  author: string;
}

// ✅ Good - 拡張可能
export interface BookWithStatus extends BookData {
  readStatus: ReadStatus;
}
```

#### type を使用する場合
- **Union型**
- **プリミティブ型のエイリアス**
- **関数型**
- **計算型（Mapped Types等）**

```typescript
// ✅ Good - Union型にはtype
export type ReadStatus = 'want_read' | 'reading' | 'finished';

// ✅ Good - 関数型
export type EventHandler = (event: Event) => void;

// ✅ Good - 計算型
export type Optional<T> = {
  [K in keyof T]?: T[K];
};
```

### 2. 命名規則

#### API型（snake_case）
- **APIから受け取る/送信するデータ**
- **サーバーのデータ構造と一致**

```typescript
export interface BookData {
  isbn: string;
  title: string;
  publisher_name: string;    // snake_case
  sales_date: string;        // snake_case
  image_url: string;         // snake_case
}
```

#### Domain型（camelCase）
- **アプリケーション内で理想的な構造**
- **JavaScript/TypeScriptの慣例に従う**

```typescript
export interface Book {
  isbn: string;
  title: string;
  publisherName: string;     // camelCase
  salesDate: string;         // camelCase
  imageUrl: string;          // camelCase
}
```

### 3. 型の分類と命名

#### API層の型
- `*Data`: APIレスポンスの基本データ
- `*Request`: APIリクエストパラメータ
- `*Response`: APIレスポンス全体
- `*Params`: クエリパラメータ

```typescript
export interface BookData { /* ... */ }
export interface CreateBookRequest { /* ... */ }
export interface BookSearchResponse { /* ... */ }
export interface BookSearchParams { /* ... */ }
```

#### Domain層の型
- 基本的なエンティティ名（`Book`, `BookShelf`等）
- `*Props`: UIコンポーネントのプロパティ
- `*State`: 状態管理用の型

```typescript
export interface Book { /* ... */ }
export interface BookCardProps { /* ... */ }
export interface BookState { /* ... */ }
```

#### UI層の型
- `*Props`: コンポーネントプロパティ
- `*Variant`: コンポーネントバリアント
- `*Theme`: テーマ関連

```typescript
export interface ButtonProps { /* ... */ }
export type ButtonVariant = 'primary' | 'secondary' | 'outline';
export interface Theme { /* ... */ }
```

### 4. 型の整理方針

#### 現在の状況
- API型とDomain型が混在
- 命名規則が不統一
- 重複した型定義

#### 統一後の構造
```
types/
├── api/           # API関連型（snake_case）
│   ├── book.ts    # BookData, BookSearchParams等
│   ├── bookshelf.ts
│   └── common.ts
├── domain/        # ドメイン型（camelCase）
│   ├── book.ts    # Book, ReadStatus等
│   ├── bookshelf.ts
│   └── user.ts
└── ui/            # UI関連型
    ├── component.ts
    └── theme.ts
```

### 5. 移行戦略

#### Phase 1: 基準確立（完了）
- interface/type使い分け基準の文書化
- 命名規則の統一

#### Phase 2: 重複排除
- 重複した型定義の統合
- 非推奨型への`@deprecated`タグ追加

#### Phase 3: プロパティ命名統一
- API型: snake_case維持
- Domain型: camelCase統一
- UI型: camelCase統一

#### Phase 4: 段階的移行
- コンポーネントで使用される型を順次更新
- 後方互換性を保ちながら移行

## 実装例

### Before（統一前）
```typescript
// 型定義が混在
interface BookProps {
  publisher_name: string;  // snake_case
  salesDate: string;       // camelCase
}

// 重複した定義
interface BookData {
  publisher_name: string;
}
```

### After（統一後）
```typescript
// API型 - snake_case
interface BookData {
  publisher_name: string;
  sales_date: string;
}

// Domain型 - camelCase
interface Book {
  publisherName: string;
  salesDate: string;
}

// UI Props型 - API型を使用
interface BookCardProps extends BookData {
  // 追加プロパティ
}
```