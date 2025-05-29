# パフォーマンス最適化ガイドライン

## 概要
このドキュメントは、Laravel MineLibrary アプリケーションでのN+1問題解決とパフォーマンス最適化の実装方法を統一するためのガイドラインです。

## N+1問題の解決方法

### 1. Eager Loading の活用

#### 基本形
```php
// 悪い例：N+1問題発生
$users = User::all();
foreach ($users as $user) {
    echo $user->posts->count(); // 各ユーザーごとにクエリ実行
}

// 良い例：Eager Loading使用
$users = User::with('posts')->get();
foreach ($users as $user) {
    echo $user->posts->count(); // 関連データは既に取得済み
}
```

#### 必要な列のみ選択
```php
// さらに最適化：必要な列のみ取得
$users = User::with([
    'posts' => function($query) {
        $query->select('id', 'user_id', 'title', 'created_at');
    }
])->select('id', 'name', 'email')->get();
```

### 2. withCount() の使用

```php
// カウントのみ必要な場合
$users = User::withCount('posts')->get();
// $user->posts_count でアクセス可能
```

### 3. JOIN クエリの活用

```php
// 関連テーブルの特定フィールドのみ必要な場合
$memos = Memo::join('users', 'memos.user_id', '=', 'users.id')
    ->where('users.is_memo_publish', true)
    ->select('memos.*', 'users.name as user_name')
    ->get();
```

## 実装例とベストプラクティス

### BookShelfController の最適化例

#### Before（N+1問題あり）
```php
$favoriteBookShelves = FavoriteBookShelf::where('user_id', $user->id)
    ->with(['bookshelf'])
    ->get()
    ->map(function ($favorite) {
        $bookShelf = $favorite->bookshelf;
        $bookCount = $bookShelf->books()->count(); // N+1発生
        $userName = $bookShelf->user->name;        // N+1発生
        // ...
    });
```

#### After（最適化済み）
```php
$favoriteBookShelves = FavoriteBookShelf::where('user_id', $user->id)
    ->with([
        'bookshelf' => function($query) {
            $query->select('id', 'user_id', 'book_shelf_name', 'description', 'is_public')
                  ->withCount('books');
        },
        'bookshelf.user' => function($query) {
            $query->select('id', 'name');
        }
    ])
    ->get()
    ->map(function ($favorite) {
        $bookShelf = $favorite->bookshelf;
        // withCountで取得済みなのでクエリ不要
        $bookCount = $bookShelf->books_count;
        $userName = $bookShelf->user->name; // eager loadingで取得済み
        // ...
    });
```

### 一括操作の実装

#### Before（ループ内でDB操作）
```php
foreach ($request->isbns as $isbn) {
    $bookShelf->addBook($isbn); // 各ISBNごとにINSERT
}
```

#### After（一括挿入）
```php
// BookShelfモデルに追加
public function addBooksInBatch(array $isbns): void
{
    $data = [];
    $timestamp = now();
    
    foreach ($isbns as $isbn) {
        $data[$isbn] = ['created_at' => $timestamp];
    }
    
    $this->books()->attach($data);
}

// コントローラーで使用
$bookShelf->addBooksInBatch($request->isbns);
```

### 重複ロジックの統一

#### Before（重複したクエリロジック）
```php
// index() メソッド
public function index(Request $request) {
    $query = FavoriteBook::where('user_id', $user->id)->with('book');
    // 処理...
}

// getFavorites() メソッド
public function getFavorites() {
    $query = FavoriteBook::where('user_id', $user->id)->with('book');
    // 同じ処理の繰り返し...
}
```

#### After（共通メソッド化）
```php
private function getFavoritesData(?string $sortBy = null)
{
    $user = Auth::user();
    
    $query = FavoriteBook::where('user_id', $user->id)
        ->with([
            'book' => function($query) {
                $query->select('isbn', 'title', 'author', /* 必要な列のみ */);
            }
        ]);

    if ($sortBy === 'newDate') {
        $query->orderBy('created_at', 'desc');
    }
    
    return $query->get()->map(/* マッピング処理 */);
}

public function index(Request $request) {
    $favorites = $this->getFavoritesData($request->input('sortBy'));
    return Inertia::render('...', ['favorites' => $favorites]);
}

public function getFavorites() {
    $favorites = $this->getFavoritesData();
    return response()->json($favorites);
}
```

## パフォーマンス測定

### クエリログの確認
```php
// デバッグ時のみ有効化
DB::enableQueryLog();
// 処理実行
$queries = DB::getQueryLog();
dd($queries); // 実行されたクエリを確認
```

### Laravel Debugbar の活用
- 開発環境で Laravel Debugbar を使用してクエリ実行回数を監視
- N+1問題が発生している箇所を特定

## 命名規則

### メソッド名
- 一括操作: `*InBatch` (例: `addBooksInBatch`)
- 共通データ取得: `get*Data` (例: `getFavoritesData`)
- withCount使用時: `*_count` 形式でアクセス

### コメント
```php
// N+1問題解決: 説明
$query = Model::with([/* 関連 */]);
```

## チェックリスト

### 実装前
- [ ] 関連データのアクセスパターンを確認
- [ ] 必要な列のみを特定
- [ ] 既存の類似実装を確認

### 実装後
- [ ] テストが全て通ることを確認
- [ ] クエリログで実行回数を確認
- [ ] 重複ロジックがないか確認

## 禁止パターン

### 1. ループ内でのDB操作
```php
// ❌ 禁止
foreach ($items as $item) {
    Model::where('id', $item->id)->update([...]);
}

// ✅ 推奨
Model::whereIn('id', $items->pluck('id'))->update([...]);
```

### 2. 不要な全データ取得
```php
// ❌ 禁止
$user = User::with('posts')->find($id);
$postCount = $user->posts->count();

// ✅ 推奨
$user = User::withCount('posts')->find($id);
$postCount = $user->posts_count;
```

### 3. 関連データへの直接アクセス
```php
// ❌ 禁止（N+1の原因）
foreach ($bookShelves as $bookShelf) {
    echo $bookShelf->user->name; // 各ループでクエリ実行
}

// ✅ 推奨（eager loading）
$bookShelves = BookShelf::with('user')->get();
foreach ($bookShelves as $bookShelf) {
    echo $bookShelf->user->name; // 事前取得済み
}
```

## まとめ

1. **Eager Loading** を積極的に活用する
2. **withCount()** でカウントを効率化する
3. **JOIN** で必要最小限のデータを取得する
4. **一括操作** でループ内DB操作を避ける
5. **重複ロジック** を共通メソッド化する
6. **テスト** で機能が壊れていないことを確認する

このガイドラインに従うことで、一貫性のあるパフォーマンス最適化を実現できます。