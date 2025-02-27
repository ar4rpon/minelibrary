# MineLibrary プロジェクト概要とフロントエンド開発ガイド

## プロジェクト概要

MineLibraryは、書籍管理・メモ・本棚機能を提供するウェブアプリケーションです。ユーザーは書籍を検索し、お気に入りに登録したり、メモを作成したり、本棚に整理したりすることができます。

### 技術スタック

- **バックエンド**: Laravel (PHP)
- **フロントエンド**: React + TypeScript
- **UI**: カスタムUIコンポーネント
- **API連携**: 楽天ブックスAPI（書籍検索）
- **データベース**: MySQL
- **開発環境**: Docker (Laravel Sail)
- **状態管理**: Inertia.js（Laravel-React連携）

## ディレクトリ構造

### フロントエンド（`resources/`ディレクトリ）

```
resources/
├── css/
│   └── app.css                 # グローバルCSS
├── ts/                         # TypeScriptソースコード
│   ├── app.tsx                 # アプリケーションのエントリーポイント
│   ├── bootstrap.ts            # 初期化スクリプト
│   ├── components/             # 共有コンポーネント
│   │   ├── book/               # 書籍関連コンポーネント
│   │   ├── bookshelf/          # 本棚関連コンポーネント
│   │   ├── common/             # 共通コンポーネント
│   │   │   ├── layout/         # レイアウト関連
│   │   │   ├── ui/             # UIコンポーネント
│   │   │   └── Icon/           # アイコンコンポーネント
│   │   └── memo/               # メモ関連コンポーネント
│   ├── features/               # 機能別モジュール
│   │   ├── auth/               # 認証機能
│   │   ├── book/               # 書籍機能
│   │   │   ├── components/     # 機能固有コンポーネント
│   │   │   ├── hooks/          # カスタムフック
│   │   │   └── pages/          # ページコンポーネント
│   │   ├── bookshelf/          # 本棚機能
│   │   ├── dashboard/          # ダッシュボード
│   │   ├── memo/               # メモ機能
│   │   ├── privacy/            # プライバシーポリシー
│   │   ├── profile/            # プロフィール管理
│   │   └── welcome/            # ウェルカムページ
│   ├── hooks/                  # 共通カスタムフック
│   ├── lib/                    # ユーティリティ関数
│   ├── Services/               # APIサービス
│   └── types/                  # 型定義
└── views/
    └── app.blade.php           # メインテンプレート
```

## アーキテクチャ

### フロントエンド

- **Inertia.js**: LaravelとReactを連携させるためのライブラリ
- **Feature-based Architecture**: 機能ごとにディレクトリを分割
- **コンポーネント設計**:
    - `components/`: 再利用可能な共通コンポーネント
    - `features/*/components/`: 機能固有のコンポーネント
    - `features/*/pages/`: ページコンポーネント

### バックエンド

- **Laravel**: PHPフレームワーク
- **MVC**: Model-View-Controllerパターン
- **Eloquent ORM**: データベース操作

## 主要機能

1. **認証機能**: ユーザー登録・ログイン
2. **書籍検索**: 楽天ブックスAPIを使用した書籍検索
3. **お気に入り書籍**: 書籍をお気に入りに登録
4. **メモ機能**: 書籍に関するメモの作成・編集・削除
5. **本棚機能**: 本棚の作成・編集・削除、書籍の追加・削除
6. **プロフィール管理**: ユーザー情報の編集

## データモデル

MineLibraryでは、以下の主要なデータモデルが使用されています：

### 書籍（Book）

```typescript
interface Book {
    isbn: string;
    title: string;
    author: string;
    sales_date: string;
    read_status: string;
}
```

### 本棚（BookShelf）

```typescript
interface BookShelfBase {
    bookShelfId: number;
    name: string;
    description: string;
    isPublic: boolean;
}
```

### メモ（Memo）

メモは書籍に関連付けられたテキストノートです。

## 新しいページの追加手順

### 1. ページコンポーネントの作成

新しい機能を追加する場合は、`resources/ts/features/`に新しいディレクトリを作成します。既存の機能に新しいページを追加する場合は、対応する`features/*/pages/`ディレクトリにファイルを追加します。

例: `resources/ts/features/example/pages/ExamplePage.tsx`

```tsx
import DefaultLayout from '@/components/common/layout';
import { Head } from '@inertiajs/react';

export default function ExamplePage() {
    return (
        <DefaultLayout header="例ページ">
            <Head title="例ページ" />

            <div className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-4 text-xl font-semibold">コンテンツ</h2>
                {/* ページコンテンツ */}
            </div>
        </DefaultLayout>
    );
}
```

### 2. ルートの追加

`routes/web.php`にルートを追加します。

```php
// 直接レンダリングする場合
Route::get('/example', function () {
    return Inertia::render('features/example/pages/ExamplePage');
})->name('example');

// コントローラーを使用する場合
Route::get('/example', [ExampleController::class, 'index'])->name('example');
```

### 3. コントローラーの作成（必要な場合）

データ処理やビジネスロジックが必要な場合は、コントローラーを作成します。

```php
// app/Http/Controllers/ExampleController.php
namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class ExampleController extends Controller
{
    public function index(Request $request)
    {
        // データ取得やビジネスロジック
        $data = [/* ... */];

        return Inertia::render('features/example/pages/ExamplePage', [
            'data' => $data,
        ]);
    }
}
```

### 4. コンポーネントの作成（必要な場合）

ページで使用する特定のコンポーネントが必要な場合は、`features/*/components/`または`components/`ディレクトリに作成します。

```tsx
// resources/ts/features/example/components/ExampleComponent.tsx
export default function ExampleComponent({ title }) {
    return (
        <div className="rounded bg-gray-100 p-4">
            <h3 className="font-medium">{title}</h3>
            {/* コンポーネントの内容 */}
        </div>
    );
}
```

### 5. カスタムフックの作成（必要な場合）

状態管理やロジックの再利用が必要な場合は、`features/*/hooks/`ディレクトリにカスタムフックを作成します。

```tsx
// resources/ts/features/example/hooks/useExample.ts
import { useState, useEffect } from 'react';

export function useExample(initialValue) {
    const [value, setValue] = useState(initialValue);

    // ロジック

    return { value, setValue };
}
```

### 6. APIサービスの作成（必要な場合）

バックエンドAPIとの通信が必要な場合は、`Services/`ディレクトリにサービスクラスを作成します。

```typescript
// resources/ts/Services/exampleService.ts
import axios from 'axios';
import { router } from '@inertiajs/react';

// API エンドポイント定義
const API_ENDPOINTS = {
    GET_DATA: '/api/example/data',
    CREATE: '/api/example/create',
    UPDATE: (id: number) => `/api/example/update/${id}`,
    DELETE: (id: number) => `/api/example/delete/${id}`,
} as const;

// エラーハンドリング用の共通関数
export const handleApiError = (error: unknown, errorMessage: string): void => {
    if (error instanceof Error) {
        console.error(`${errorMessage}: ${error.message}`);
    } else {
        console.error(`${errorMessage}: 予期せぬエラーが発生しました`);
    }
};

// データ取得
export const getData = async () => {
    try {
        const response = await axios.get(API_ENDPOINTS.GET_DATA);
        return response.data;
    } catch (error) {
        handleApiError(error, 'データの取得に失敗しました');
        return [];
    }
};

// データ作成
export const createData = async (data: any) => {
    try {
        const response = await axios.post(API_ENDPOINTS.CREATE, data);
        router.reload(); // 成功したら画面をリロード
        return response.data;
    } catch (error) {
        handleApiError(error, 'データの作成に失敗しました');
        return null;
    }
};
```

### 7. ナビゲーションへのリンク追加（必要な場合）

ナビゲーションメニューに新しいページへのリンクを追加する場合は、`resources/ts/components/common/layout/Navigation.tsx`を編集します。

## 開発フロー

1. **環境構築**: README.mdの手順に従って開発環境をセットアップ
2. **機能開発**: 上記の手順に従って新しい機能やページを追加
3. **テスト**: 機能のテスト（PHPUnitやJestを使用）
4. **デプロイ**: 本番環境へのデプロイ

## 注意事項

- TypeScriptの型定義を適切に行い、型安全性を確保する
- コンポーネントには適切なコメントを記述する
- UIコンポーネントは`components/common/ui/`から再利用する
- レイアウトは基本的に`DefaultLayout`を使用する
- APIとの通信は`Services/`ディレクトリのサービスクラスを使用する

## 実装例

### APIサービスの使用例

```tsx
// resources/ts/features/example/pages/ExamplePage.tsx
import { useEffect, useState } from 'react';
import DefaultLayout from '@/components/common/layout';
import { Head } from '@inertiajs/react';
import { getData } from '@/Services/exampleService';

export default function ExamplePage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const result = await getData();
            setData(result);
            setLoading(false);
        };

        fetchData();
    }, []);

    return (
        <DefaultLayout header="例ページ">
            <Head title="例ページ" />

            <div className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-4 text-xl font-semibold">データ一覧</h2>

                {loading ? (
                    <p>読み込み中...</p>
                ) : (
                    <ul className="space-y-2">
                        {data.map((item) => (
                            <li key={item.id} className="border-b pb-2">
                                {item.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </DefaultLayout>
    );
}
```

### カスタムフックの使用例

```tsx
// resources/ts/features/example/hooks/useDataFetching.ts
import { useState, useEffect } from 'react';
import { getData } from '@/Services/exampleService';

export function useDataFetching() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await getData();
            setData(result);
        } catch (err) {
            setError('データの取得に失敗しました');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { data, loading, error, refetch: fetchData };
}
```

## 参考リソース

- [Laravel ドキュメント](https://laravel.com/docs)
- [React ドキュメント](https://reactjs.org/docs)
- [Inertia.js ドキュメント](https://inertiajs.com/)
- [TypeScript ドキュメント](https://www.typescriptlang.org/docs)
