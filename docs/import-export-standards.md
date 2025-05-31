# インポート/エクスポート標準化ガイドライン

## インポート順序標準

### 1. 標準インポート順序
```typescript
// 1. React and external libraries
import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { MoreVertical, Plus } from 'lucide-react';

// 2. Internal API/services
import { useAsyncState } from '@/api/hooks';
import { BookService, MemoService } from '@/api/services';

// 3. UI components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// 4. Common components
import { BaseCard } from '@/components/common/BaseCard';
import { Navigation } from '@/components/common/Navigation';

// 5. Domain components
import { BookCard } from '@/components/domain/book';
import { MemoDialog } from '@/components/domain/memo/dialogs';

// 6. Hooks
import { useDialogState } from '@/hooks/common';
import { useBook, useMemo } from '@/hooks/domain';

// 7. Types
import type { BookData } from '@/types/api';
import type { Book } from '@/types/domain';

// 8. Local/relative imports
import { Header } from './Header';
import { Image } from './Image';
```

### 2. グループ内の並び順
- **アルファベット順**: 同じグループ内では原則としてアルファベット順
- **関連性**: 密接に関連するインポートは近くに配置

## エクスポートパターン標準

### 1. コンポーネントエクスポート
```typescript
// ✅ 推奨: named export + default export（後方互換性）
export function BookCard(props: BookCardProps) {
  // component implementation
}

export default BookCard;
```

### 2. フックエクスポート
```typescript
// ✅ 推奨: named export のみ
export function useBook() {
  // hook implementation
}

export function useMemo() {
  // hook implementation
}
```

### 3. 型定義エクスポート
```typescript
// ✅ 推奨: 型は常に named export
export interface BookData {
  // type definition
}

export type ReadStatus = 'want_read' | 'reading' | 'finished';
```

### 4. サービス・ユーティリティエクスポート
```typescript
// ✅ 推奨: named export
export const BookService = {
  // service implementation
};

export const formatDate = (date: string) => {
  // utility implementation
};
```

## バレルエクスポート（index.ts）標準

### 1. 基本パターン
```typescript
// components/domain/book/index.ts
export { BookCard } from './card';
export { BookDialog } from './dialogs';
export { ReadStatusBadge } from './ReadStatusBadge';

// 型も一緒にエクスポート
export type { BookCardProps } from './card';
```

### 2. 階層的なエクスポート
```typescript
// hooks/domain/index.ts
export { useBook } from './useBook';
export { useBookShelf } from './useBookShelf';
export { useMemo } from './useMemo';
export { useFavoriteBook } from './useFavoriteBook';
```

### 3. 型専用のバレルエクスポート
```typescript
// types/api/index.ts
export type { BookData, BookSearchParams } from './book';
export type { BookShelfData, CreateBookShelfData } from './bookshelf';
export type { MemoData, CreateMemoRequest } from './memo';
export type { ApiResponse, PaginatedResponse } from './common';
```

## import文の記述規則

### 1. type-only imports
```typescript
// ✅ 型のインポートには type を明示
import type { BookData } from '@/types/api';
import type { ComponentProps } from 'react';

// ❌ 型でも値でも使用する場合は通常のimport
import { BookService } from '@/api/services';
```

### 2. 複数行インポート
```typescript
// ✅ 複数のexportがある場合は改行して見やすく
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// ✅ 短い場合は1行でも可
import { Button, Card } from '@/components/ui';
```

### 3. デフォルトとnamed importの混在
```typescript
// ✅ デフォルトimportは先に記述
import React, { useState, useEffect } from 'react';
import BookCard, { BookCardProps } from '@/components/domain/book';
```

## コメント規則

### 1. グループコメント
```typescript
// ✅ 各グループにコメントを付与
// 1. React and external libraries
import { useState } from 'react';

// 2. Internal API/services
import { BookService } from '@/api/services';

// ✅ 該当するインポートがない場合もコメント
// 3. UI components
// (none in this component)
```

### 2. 特殊ケースのコメント
```typescript
// ✅ 特殊な理由でのインポート順序変更時はコメント
import { router } from '@inertiajs/react'; // 特定の初期化順序が必要
import { useState } from 'react';
```

## 適用対象ファイル

### 1. 必須適用
- 全ての `.tsx` コンポーネントファイル
- 全ての カスタムフックファイル (`.ts`)
- 全ての サービスファイル (`.ts`)

### 2. 推奨適用
- ユーティリティファイル
- 型定義ファイル
- テストファイル

### 3. 除外
- 設定ファイル（`vite.config.ts` 等）
- 自動生成ファイル

## ESLint設定

```json
{
  "rules": {
    "import/order": [
      "error",
      {
        "groups": [
          "builtin",
          "external", 
          "internal",
          "parent",
          "sibling",
          "index"
        ],
        "pathGroups": [
          {
            "pattern": "@/api/**",
            "group": "internal",
            "position": "before"
          },
          {
            "pattern": "@/components/ui/**",
            "group": "internal"
          },
          {
            "pattern": "@/components/common/**",
            "group": "internal" 
          },
          {
            "pattern": "@/components/domain/**",
            "group": "internal"
          },
          {
            "pattern": "@/hooks/**",
            "group": "internal"
          },
          {
            "pattern": "@/types/**",
            "group": "internal"
          }
        ],
        "newlines-between": "always"
      }
    ]
  }
}
```

## 移行戦略

### Phase 1: 新規ファイル
- 新しく作成するファイルは必ず標準に従う

### Phase 2: 既存ファイル（重要度順）
1. コンポーネントファイル
2. カスタムフック
3. サービスファイル
4. 型定義ファイル

### Phase 3: 自動化
- ESLint ruleの追加
- pre-commit hookでの自動修正