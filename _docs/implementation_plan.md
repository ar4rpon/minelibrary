# 実装計画：他ユーザーの本棚アクセスと本棚一覧の改善

## 1. 他ユーザーの本棚にアクセスするルートの追加

### 1.1 ルートの追加

`routes/web.php`に他ユーザーの本棚一覧と詳細を表示するルートを追加します。

```php
// 他のユーザーの本棚一覧
Route::get('/user/{userId}/book-shelves', [BookShelfController::class, 'userBookShelves'])->name('user.book-shelves');

// 他のユーザーの本棚詳細
Route::get('/user/{userId}/book-shelf/{bookShelfId}', [BookShelfController::class, 'userBookShelf'])->name('user.book-shelf');
```

### 1.2 コントローラーメソッドの追加

`BookShelfController`に新しいメソッドを追加します。

```php
/**
 * 指定したユーザーの公開本棚一覧を表示
 *
 * @param int $userId
 * @return \Inertia\Response
 */
public function userBookShelves($userId)
{
    // ユーザーの存在確認
    $user = User::findOrFail($userId);

    // 公開されている本棚のみ取得
    $bookshelves = BookShelf::where('user_id', $userId)
        ->where('is_public', true)
        ->select(
            'id as bookShelfId',
            'book_shelf_name as name',
            'description',
            'is_public as isPublic'
        )
        ->get()
        ->map(function ($bookshelf) {
            $bookCount = BookShelf::getBooks($bookshelf->bookShelfId)->count();
            return [
                'bookShelfId' => $bookshelf->bookShelfId,
                'name' => $bookshelf->name,
                'description' => $bookshelf->description,
                'isPublic' => $bookshelf->isPublic,
                'bookCount' => $bookCount,
            ];
        });

    return Inertia::render('features/bookshelf/pages/UserBookShelfList', [
        'user' => [
            'id' => $user->id,
            'name' => $user->name,
        ],
        'bookshelves' => $bookshelves
    ]);
}

/**
 * 指定したユーザーの特定の公開本棚を表示
 *
 * @param int $userId
 * @param int $bookShelfId
 * @return \Inertia\Response
 */
public function userBookShelf($userId, $bookShelfId)
{
    // ユーザーの存在確認
    $user = User::findOrFail($userId);

    // 公開されている本棚のみ取得
    $bookShelf = BookShelf::where('id', $bookShelfId)
        ->where('user_id', $userId)
        ->where('is_public', true)
        ->firstOrFail();

    $books = BookShelf::getBooks($bookShelf->id)->map(function ($book) {
        return [
            'isbn' => $book->isbn,
            'book' => [
                'title' => $book->title,
                'author' => $book->author,
                'publisher_name' => $book->publisher_name,
                'sales_date' => $book->sales_date,
                'image_url' => $book->image_url,
                'item_caption' => $book->item_caption,
                'item_price' => $book->item_price,
            ],
        ];
    });

    // 現在のユーザーがこの本棚をお気に入りに登録しているか確認
    $isFavorited = false;
    if (Auth::check()) {
        $isFavorited = $bookShelf->isFavoritedBy(Auth::id());
    }

    return Inertia::render('features/bookshelf/pages/UserBookShelfDetail', [
        'user' => [
            'id' => $user->id,
            'name' => $user->name,
        ],
        'bookShelf' => [
            'id' => $bookShelf->id,
            'name' => $bookShelf->book_shelf_name,
            'description' => $bookShelf->description,
            'isPublic' => $bookShelf->is_public,
            'isFavorited' => $isFavorited,
        ],
        'books' => $books,
    ]);
}
```

### 1.3 フロントエンドの実装

新しいページコンポーネントを作成します。

- `resources/ts/features/bookshelf/pages/UserBookShelfList.tsx`
- `resources/ts/features/bookshelf/pages/UserBookShelfDetail.tsx`

これらのコンポーネントは既存の`BookShelfList.tsx`と`BookShelfDetail.tsx`を参考に実装します。

### 1.4 プロフィールページの修正

`resources/ts/features/profile/pages/Show.tsx`の本棚セクションを修正して、他ユーザーのプロフィールページから本棚一覧ページへのリンクを追加します。

```tsx
{
    /* 本棚 */
}
<section>
    <div className="mb-4 flex items-center justify-between rounded-sm border border-green-600 bg-white px-4 py-3 shadow-md">
        <h2 className="text-xl font-semibold text-green-700">本棚</h2>
        {isOwnProfile ? (
            <Link
                href={route('book-shelf.list')}
                className="text-sm font-medium text-green-600 hover:text-green-700"
            >
                すべて見る
            </Link>
        ) : (
            <Link
                href={route('user.book-shelves', { userId: user.id })}
                className="text-sm font-medium text-green-600 hover:text-green-700"
            >
                すべて見る
            </Link>
        )}
    </div>
    {/* 本棚カード表示部分 */}
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {bookShelves.length > 0 ? (
            bookShelves.map((bookShelf) => (
                <Card key={bookShelf.id} className="overflow-hidden">
                    {/* カード内容 */}
                    <CardContent>
                        {/* ... */}
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                                {bookShelf.created_at}
                            </span>
                            <div className="flex items-center space-x-2">
                                {/* お気に入りボタン */}
                                {!isOwnProfile &&
                                    auth.user &&
                                    bookShelf.user_id !== auth.user.id && (
                                        <button
                                            onClick={() =>
                                                toggleFavorite(bookShelf.id)
                                            }
                                            disabled={
                                                isProcessing[bookShelf.id]
                                            }
                                            className={`flex items-center justify-center rounded-full p-1 transition-colors ${
                                                favoriteStates[bookShelf.id]
                                                    ? 'text-red-500 hover:bg-red-50'
                                                    : 'text-gray-400 hover:bg-gray-50 hover:text-red-500'
                                            }`}
                                            title={
                                                favoriteStates[bookShelf.id]
                                                    ? 'お気に入りから削除'
                                                    : 'お気に入りに追加'
                                            }
                                        >
                                            <Heart
                                                className={`h-5 w-5 ${favoriteStates[bookShelf.id] ? 'fill-current' : ''}`}
                                            />
                                        </button>
                                    )}
                                {/* 詳細リンク - 自分の本棚か他人の本棚かで分岐 */}
                                <Link
                                    href={
                                        isOwnProfile
                                            ? route('book-shelf.detail', {
                                                  book_shelf_id: bookShelf.id,
                                              })
                                            : route('user.book-shelf', {
                                                  userId: user.id,
                                                  bookShelfId: bookShelf.id,
                                              })
                                    }
                                    className="text-sm font-medium text-green-600 hover:text-green-700"
                                >
                                    詳細を見る
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))
        ) : (
            <div className="col-span-full rounded-md border border-dashed border-gray-300 p-6 text-center">
                <BookOpen className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                <p className="text-gray-500">本棚はまだありません</p>
            </div>
        )}
    </div>
</section>;
```

## 2. 本棚一覧に自分の本棚とお気に入り本棚を表示する修正

### 2.1 コントローラーの修正

`BookShelfController`の`index`メソッドを修正して、自分の本棚とお気に入り本棚の両方を返すようにします。

```php
public function index()
{
    $user = Auth::user();

    // 自分の本棚を取得
    $myBookshelves = BookShelf::where('user_id', $user->id)
        ->select(
            'id as bookShelfId',
            'book_shelf_name as name',
            'description',
            'is_public as isPublic'
        )
        ->get()
        ->map(function ($bookshelf) {
            return [
                'bookShelfId' => $bookshelf->bookShelfId,
                'name' => $bookshelf->name,
                'description' => $bookshelf->description,
                'isPublic' => $bookshelf->isPublic,
                'type' => 'my' // 自分の本棚を識別するためのタイプ
            ];
        });

    // お気に入り本棚を取得
    $favoriteBookShelves = FavoriteBookShelf::where('user_id', $user->id)
        ->with('bookshelf')
        ->get()
        ->map(function ($favorite) {
            $bookShelf = $favorite->bookshelf;
            return [
                'bookShelfId' => $bookShelf->id,
                'name' => $bookShelf->book_shelf_name,
                'description' => $bookShelf->description,
                'isPublic' => $bookShelf->is_public,
                'type' => 'favorite', // お気に入り本棚を識別するためのタイプ
                'owner' => [
                    'id' => $bookShelf->user->id,
                    'name' => $bookShelf->user->name,
                ],
            ];
        });

    return Inertia::render('features/bookshelf/pages/BookShelfList', [
        'initialBookShelves' => [
            'my' => $myBookshelves,
            'favorite' => $favoriteBookShelves
        ]
    ]);
}
```

### 2.2 フロントエンドの修正

`BookShelfList.tsx`を修正して、自分の本棚とお気に入り本棚を表示するようにします。

```tsx
// 型定義の修正
interface Props {
    initialBookShelves?: {
        my: BookShelf[];
        favorite: BookShelf[];
    };
}

// コンポーネントの修正
export default function BookShelfList({
    initialBookShelves = { my: [], favorite: [] },
}: Props) {
    // 状態管理
    const [myBookShelves, setMyBookShelves] = useState<BookShelf[]>(
        initialBookShelves.my,
    );
    const [favoriteBookShelves, setFavoriteBookShelves] = useState<BookShelf[]>(
        initialBookShelves.favorite,
    );
    const [activeTab, setActiveTab] = useState<'my' | 'favorite'>('my');

    // 表示する本棚を選択
    const displayBookShelves =
        activeTab === 'my' ? myBookShelves : favoriteBookShelves;

    // タブ切り替え
    const handleTabChange = (tab: 'my' | 'favorite') => {
        setActiveTab(tab);
    };

    // 以下、既存のコードを修正...
}
```

## 3. BookShelfCardの画像はそのままにする

現在の`DefaultCard.tsx`の画像表示部分はそのままにします。

```tsx
<Image imageUrl={image || ''} name={name} variant="card" />
```

## 実装手順

1. まず、`BookShelfController`に新しいメソッドを追加します。
2. 次に、`routes/web.php`に新しいルートを追加します。
3. `BookShelfController`の`index`メソッドを修正します。
4. フロントエンドの`BookShelfList.tsx`を修正します。
5. プロフィールページ（`Show.tsx`）の本棚セクションを修正します。
6. 新しいページコンポーネント`UserBookShelfList.tsx`と`UserBookShelfDetail.tsx`を作成します。
7. テストして動作確認を行います。

## 注意点

- 他ユーザーの本棚は公開設定（is_public = true）のものだけを表示するようにします。
- お気に入り本棚の表示では、所有者の情報も表示するようにします。
- 本棚カードの画像表示部分は変更しません。
