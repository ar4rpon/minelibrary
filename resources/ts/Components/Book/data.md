Models/Book.php```

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Book extends Model
{
    use HasFactory;
    /**
     * モデルのIDを自動増分するか
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * テーブルに関連付ける主キー
     *
     * @var string
     */
    protected $primaryKey = 'isbn';

    /**
     * 主キーIDのデータ型
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * 複数代入可能な属性
     *
     * @var array<string>
     */
    protected $fillable = [
        'isbn',
        'author',
        'publisher_name',
        'sales_date',
        'title',
        'image_url',
        'item_caption',
        'item_price',
    ];

    /**
     * 属性のキャスト
     *
     * @var array<string, string>
     */
    protected $casts = [
        'item_price' => 'integer',
    ];


    /**
     * 本を追加するメソッド
     *
     * @param array $data
     * @return Book
     */
    public function addBook(array $data): Book
    {
        return self::create($data);
    }

    /**
     * ISBNで本の情報を取得するメソッド
     *
     * @param string $isbn
     * @return Book|null
     */
    public function getBookInfo(string $isbn): ?Book
    {
        return self::find($isbn);
    }
}

```

Models/BookShelf.php```
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class BookShelf extends Model
{
    use HasFactory;

    /**
     * 複数代入可能な属性
     *
     * @var array<string>
     */
    protected $fillable = [
        'book_shelf_name',
        'description',
        'user_id',
        'is_public',
    ];

    /**
     * 属性のキャスト
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_public' => 'boolean',
    ];

    /**
     * 本のリストを取得する
     *
     * @return BelongsToMany
     */
    public function books(): BelongsToMany
    {
        return $this->belongsToMany(Book::class, 'book_shelf_book', 'book_shelf_id', 'isbn');
    }

    /**
     * 新しいブックリストを追加する
     *
     * @param array $data
     * @return self
     */
    public static function add(array $data): self
    {
        return self::create($data);
    }

    /**
     * ブックリストの名前を更新する
     *
     * @param string $name
     * @return bool
     */
    public function updateName(string $name): bool
    {
        return $this->update(['book_shelf_name' => $name]);
    }

    /**
     * ブックリストの公開状態を更新する
     *
     * @param bool $isPublic
     * @return bool
     */
    public function updateIsPublic(bool $isPublic): bool
    {
        return $this->update(['is_public' => $isPublic]);
    }

    /**
     * ブックリストの説明を更新する
     *
     * @param string $text
     * @return bool
     */
    public function updateDescription(string $text): bool
    {
        return $this->update(['description' => $text]);
    }

    /**
     * 指定されたユーザーIDの全てのブックリストを取得する
     *
     * @param int $userId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getAllByUserId(int $userId): \Illuminate\Database\Eloquent\Collection
    {
        return self::where('create_by_id', $userId)->get();
    }

    /**
     * 本を追加する
     *
     * @param string $isbn
     * @return void
     */
    public function addBook(string $isbn): void
    {
        $this->books()->attach($isbn, ['created_at' => now()]);
    }

    /**
     * 指定されたブックリストIDの全ての書籍データを取得する
     *
     * @param int $bookShelfId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getBooks(int $bookShelfId): \Illuminate\Database\Eloquent\Collection
    {
        $bookShelf = self::findOrFail($bookShelfId);
        return $bookShelf->books()->get();
    }

    /**
     * 本を削除する
     *
     * @param string $isbn
     * @return void
     */
    public function removeBook(string $isbn): void
    {
        $this->books()->detach($isbn);
    }
}

```

Models/FavoriteBook.php```
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Enums\ReadStatus;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Collection;


class FavoriteBook extends Model
{
    use HasFactory;

    /**
     * 複数代入可能な属性
     *
     * @var array<mixed>
     */
    protected $fillable = [
        'isbn',
        'read_status',
        'user_id',
    ];

    /**
     * 属性のキャスト
     *
     * @var array<string, string>
     */
    protected $casts = [
        'read_status' => ReadStatus::class,
    ];

    /**
     * お気に入り追加しているユーザーのデータを取得する
     *
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * お気に入り本の詳細データを取得する
     *
     * @return BelongsTo
     */
    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class, 'isbn', 'isbn');
    }

    /**
     * お気に入りの本を追加する
     *
     * @param string $isbn
     * @param int $userId
     * @return self
     */
    public static function addFavorite(string $isbn, int $userId): self
    {
        return self::create([
            'isbn' => $isbn,
            'user_id' => $userId,
            'read_status' => ReadStatus::WANTREAD,
        ]);
    }


    /**
     * 指定されたユーザーIDのお気に入りの本を取得する
     *
     * @param int $userId
     * @return Collection
     */
    public static function getFavoritesByUserId(int $userId): Collection
    {
        return self::where('user_id', $userId)->get();
    }

    /**
     * 指定されたISBNとユーザーIDに対応するお気に入り本が存在するかを判定する
     *
     * @param string $isbn
     * @param int $userId
     * @return bool
     */
    public static function isFavorite(string $isbn, int $userId): bool
    {
        return self::where('isbn', $isbn)
            ->where('user_id', $userId)
            ->exists();
    }
}

```

Models/Memo.php```
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Memo extends Model
{
    use HasFactory;

    /**
     * 複数代入可能な属性
     *
     * @var array<string, mixed>
     */
    protected $fillable = [
        'isbn',
        'memo',
        'memo_chapter',
        'memo_page',
        'user_id',
    ];

    /**
     * 属性のキャスト
     *
     * @var array<string, string>
     */
    protected $casts = [
        'memo_page' => 'integer',
        'memo_chapter' => 'integer',
        'isbn' => 'string',
    ];

    /**
     * メモを書いた本の詳細データを取得する
     *
     * @return BelongsTo
     */
    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class, 'isbn', 'isbn');
    }

    /**
     * メモを作成したユーザーのデータを取得する
     *
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * メモを作成する
     *
     * @param string $isbn
     * @param string $memo
     * @param int $userId
     * @param string|null $memoChapter
     * @param int|null $memoPage
     * @return self
     */
    public static function createMemo(string $isbn, string $memo, int $userId, ?string $memoChapter = null, ?int $memoPage = null): self
    {
        return self::create([
            'isbn' => $isbn,
            'memo' => $memo,
            'user_id' => $userId,
            'memo_chapter' => $memoChapter,
            'memo_page' => $memoPage,
        ]);
    }

    /**
     * メモを更新する
     *
     * @param string $memo
     * @param int|null $memoChapter
     * @param int|null $memoPage
     * @return bool
     */
    public function updateMemo(string $memo, ?int $memoChapter = null, ?int $memoPage = null): bool
    {
        return $this->update([
            'memo' => $memo,
            'memo_chapter' => $memoChapter,
            'memo_page' => $memoPage,
        ]);
    }
}

```

Models/User.php```
<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * 複数代入可能な属性
     *
     * @var list<string>
     */
    protected $fillable = [
        'email',
        'password',
        'name',
        'profile_image',
        'profile_message',
        'is_memo_publish',
    ];

    /**
     * シリアライズ時に隠すべき属性
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * キャストすべき属性
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * ユーザーのお気に入りの本を取得
     *
     * @return HasMany
     */
    public function favoriteBooks(): HasMany
    {
        return $this->hasMany(FavoriteBook::class);
    }

    /**
     * ユーザーのお気に入りの本リストを取得
     *
     * @return HasMany
     */
    public function favoriteBookLists(): HasMany
    {
        return $this->hasMany(FavoriteBookShelf::class);
    }

    /**
     * The books that the user has favorited.
     */
    public function favorites()
    {
        return $this->belongsToMany(Book::class, 'favorites', 'user_id', 'book_id');
    }
}

```

Controllers/BookController.php```
<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;


class BookController extends Controller
{
    public function getOrStore(Request $request)
    {
        $request->validate([
            'isbn' => 'required|string',
            'title' => 'required|string',
            'author' => 'required|string',
            'publisher_name' => 'required|string',
            'sales_date' => 'required|string',
            'image_url' => 'required|string',
            'item_caption' => 'required|string',
            'item_price' => 'required|integer',
        ]);

        $bookData = $request->only([
            'isbn',
            'title',
            'author',
            'publisher_name',
            'sales_date',
            'image_url',
            'item_caption',
            'item_price',
        ]);

        $existingBook = (new Book())->getBookInfo($request->isbn);

        if ($existingBook) {
            return $existingBook;
        }

        $book = (new Book())->addBook($bookData);
        return $book;
    }
}

```

Controllers/BookSearchController.php```
<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\Http;
// use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class BookSearchController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'keyword' => 'nullable|string',
            'page' => 'integer|min:1',
            'genre' => 'string',
            'sort' => 'string',
            'searchMethod' => 'in:title,isbn',
        ]);

        $results = [];
        $totalItems = 0;

        if ($request->filled('keyword')) {
            $response = Http::get('https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404', [
                'applicationId' => config('rakuten.app_id'),
                'title' => $validated['searchMethod'] === 'title' ? $validated['keyword'] : null,
                'page' => $validated['page'] ?? 1,
                'booksGenreId' => $validated['genre'] !== 'all' ? $validated['genre'] : null,
                'sort' => $validated['sort'] ?? 'standard',
                'isbn' => $validated['searchMethod'] === 'isbn' ? $validated['keyword'] : null,
                'hits' => 9,
            ]);

            $data = $response->json();
            $results = $data['Items'] ?? [];
            $totalItems = $data['count'] ?? 0;
        }
        $results = array_map(function ($item) {
            if (isset($item['Item']['largeImageUrl'])) {
                $item['Item']['largeImageUrl'] = str_replace(
                    'ex=200x200',
                    'ex=300x300',
                    $item['Item']['largeImageUrl']
                );
            }
            // 変数名を統一するためにキーを追加
            $item['Item']['publisher_name'] = $item['Item']['publisherName'];
            $item['Item']['item_caption'] = $item['Item']['itemCaption'];
            $item['Item']['sales_date'] = $item['Item']['salesDate'];
            $item['Item']['item_price'] = $item['Item']['itemPrice'];
            $item['Item']['image_url'] = $item['Item']['largeImageUrl'];

            return $item;
        }, $results);

        return Inertia::render('SearchBook', [
            'results' => $results,
            'totalItems' => $totalItems,
            'filters' => $validated,
        ]);
    }
}

```
Controllers/BookShelfContoller.php```
<?php

namespace App\Http\Controllers;

use App\Models\BookShelf;
use App\Models\FavoriteBook;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use Illuminate\Http\Request;

class BookShelfController extends Controller
{
    public function show($book_shelf_id)
    {
        $user = Auth::user();
        $bookShelf = BookShelf::where('id', $book_shelf_id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $books = BookShelf::getBooks($book_shelf_id)->map(function ($book) use ($user) {
            $favoriteBook = FavoriteBook::where('isbn', $book->isbn)
                ->where('user_id', $user->id)
                ->first();
            return [
                'isbn' => $book->isbn,
                'read_status' => $favoriteBook ? $favoriteBook->read_status : null,
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

        return Inertia::render('BookShelf/BookShelfDetail', [
            'bookShelf' => $bookShelf,
            'books' => $books,
            'bookShelfId' => $book_shelf_id,
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'book_shelf_name' => 'required|string',
            'description' => 'required|string',
        ]);
        $bookShelf = (new BookShelf())->add(
            [
                'user_id' => $user->id,
                'book_shelf_name' => $request->book_shelf_name,
                'description' => $request->description,
                'is_public' => true
            ]
        );
        return $bookShelf;
    }

    public function update(Request $request) {}

    public function getMyAll()
    {
        $user = Auth::user();

        $bookshelves = BookShelf::where('user_id', $user->id)
            ->select(
                'id',
                'book_shelf_name',
                'description',
                'is_public'
            )
            ->get();

        return response()->json($bookshelves);
    }

    public function addBooks(Request $request)
    {
        $request->validate([
            'book_shelf_id' => 'required|exists:book_shelves,id',
            'isbns' => 'required|array',
            'isbns.*' => 'required|string|exists:books,isbn'
        ]);

        $bookShelf = BookShelf::findOrFail($request->book_shelf_id);

        foreach ($request->isbns as $isbn) {
            $bookShelf->addBook($isbn);
        }

        return response()->json(['message' => 'Books added successfully'], 200);
    }

    public function getBooks(Request $request)
    {

        $request->validate([
            'book_shelf_id' => 'required|exists:book_shelves,id',
        ]);

        $books = BookShelf::getBooks($request->book_shelf_id)->map(function ($book) {
            $user = Auth::user();
            $favoriteBook = FavoriteBook::where('isbn', $book->isbn)
                ->where('user_id', $user->id)
                ->first();
            return [
                'isbn' => $book->isbn,
                'read_status' => $favoriteBook->read_status,
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

        return response()->json($books);
    }

    public function removeBook(Request $request)
    {
        $request->validate([
            'book_shelf_id' => 'required|exists:book_shelves,id',
            'isbn' => 'required|string|exists:books,isbn',
        ]);

        $user = Auth::user();
        $bookShelf = BookShelf::where('id', $request->book_shelf_id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $bookShelf->removeBook($request->isbn);

        return response()->json(['message' => 'Book removed successfully'], 200);
    }
}

```

/Controllers/FavoriteBookController.php```
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FavoriteBook;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\BookController;

class FavoriteBookController extends Controller
{
    protected $bookController;

    public function __construct(BookController $bookController)
    {
        $this->bookController = $bookController;
    }

    public function index(Request $request)
    {
        $user = Auth::user();
        $sortBy = $request->input('sortBy', 'newDate');

        $query = FavoriteBook::where('user_id', $user->id)->with('book');

        if ($sortBy === 'newDate') {
            $query->orderBy('created_at', 'desc');
        } elseif ($sortBy === 'oldDate') {
            $query->orderBy('created_at', 'asc');
        }

        $favorites = $query->get()->map(function ($favorite) {
            return [
                'isbn' => $favorite->isbn,
                'read_status' => $favorite->read_status,
                'created_at' => $favorite->created_at,
                'book' => [
                    'title' => $favorite->book->title,
                    'author' => $favorite->book->author,
                    'publisher_name' => $favorite->book->publisher_name,
                    'sales_date' => $favorite->book->sales_date,
                    'image_url' => $favorite->book->image_url,
                    'item_caption' => $favorite->book->item_caption,
                    'item_price' => $favorite->book->item_price,
                ],
            ];
        });

        return Inertia::render('FavoriteBookList', [
            'favorites' => $favorites,
            'sortBy' => $sortBy,
        ]);
    }

    public function updateReadStatus(Request $request)
    {
        $user = Auth::user();
        $favorite = FavoriteBook::where('user_id', $user->id)
            ->where('isbn', $request->isbn)
            ->first();

        if ($favorite) {
            $favorite->update(['read_status' => $request->readStatus]);
            return response()->json(['readStatus' => $request->readStatus]);
        }
    }

    public function toggleFavorite(Request $request)
    {
        $book = $this->bookController->getOrStore($request);
        $user = Auth::user();

        $isFavorite = FavoriteBook::isFavorite($book->isbn, $user->id);

        if ($isFavorite) {
            FavoriteBook::where('isbn', $book->isbn)
                ->where('user_id', $user->id)
                ->delete();
            $isFavorite = false;
        } else {
            FavoriteBook::addFavorite($book->isbn, $user->id);
            $isFavorite = true;
        }

        return response()->json(['isFavorite' => $isFavorite]);
    }

    public function getFavoriteStatus(Request $request)
    {
        $user = Auth::user();
        $isFavorite = FavoriteBook::isFavorite($request->isbn, $user->id);

        return response()->json(['isFavorite' => $isFavorite]);
    }
}

```

Controllers/MemoController.php```
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\BookController;
use App\Models\Memo;
use Illuminate\Support\Facades\Auth;
// use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class MemoController extends Controller
{
    protected $bookController;

    public function __construct(BookController $bookController)
    {
        $this->bookController = $bookController;
    }

    public function index(Request $request)
    {
        $user = Auth::user();
        $sortBy = $request->input('sortBy', 'date');

        $query = Memo::where('user_id', $user->id)->with('book');

        if ($sortBy === 'date') {
            $query->orderBy('created_at', 'desc');
        } elseif ($sortBy === 'title') {
            $query->join('books', 'memos.isbn', '=', 'books.isbn')
                ->orderBy('books.title');
        }

        $memos = $query->get()->groupBy('isbn')->map(function ($group) {
            return [
                'id' => $group->first()->isbn,
                'contents' => $group->map(function ($memo) {
                    return [
                        'id' => $memo->id,
                        'memo' => $memo->memo,
                        'memo_chapter' => $memo->memo_chapter,
                        'memo_page' => $memo->memo_page,
                    ];
                })->toArray(),
                'book' => array_merge($group->first()->book->toArray(), [
                    'isbn' => $group->first()->book->isbn,
                    'publisher_name' => $group->first()->book->publisher_name,
                    'item_caption' => $group->first()->book->item_caption,
                    'sales_date' => $group->first()->book->sales_date,
                    'item_price' => $group->first()->book->item_price,
                    'image_url' => $group->first()->book->image_url,
                ]),
            ];
        })->values();

        return Inertia::render('MemoList', [
            'memos' => $memos,
            'sortBy' => $sortBy,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'isbn' => 'required|string',
            'memo' => 'required|string',
            'memo_chapter' => 'nullable|integer',
            'memo_page' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }


        // メモの作成
        $user = Auth::user();
        $memo = Memo::createMemo(
            $request->isbn,
            $request->memo,
            $user->id,
            $request->memo_chapter,
            $request->memo_page
        );

        return response()->json(['memo' => $memo], 201);
    }

    public function update(Request $request, $memo_id)
    {
        $user = Auth::user();
        $memo = Memo::where('id', $memo_id)->where('user_id', $user->id)->first();

        $validator = Validator::make($request->all(), [
            'memo' => 'required|string',
            'memo_chapter' => 'nullable|integer',
            'memo_page' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $memo->updateMemo(
            $request->memo,
            $request->memo_chapter,
            $request->memo_page
        );
    }

    public function destroy($memo_id)
    {
        $user = Auth::user();
        $memo = Memo::where('id', $memo_id)->where('user_id', $user->id)->first();

        if ($memo->delete()) {
            return response()->json(['message' => 'Memo deleted successfully'], 200);
        } else {
            return response()->json(['error' => 'Failed to delete memo'], 500);
        }
    }

    public function getBookMemos($isbn)
    {
        $user = Auth::user();
        $memos = Memo::where('isbn', $isbn)
            ->with('user')
            // 登録ユーザーのメモを判別させる
            ->orderByRaw("CASE WHEN user_id = ? THEN 0 ELSE 1 END", [$user->id])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($memo) use ($user) {
                return [
                    'id' => $memo->id,
                    'memo' => $memo->memo,
                    'memo_chapter' => $memo->memo_chapter,
                    'memo_page' => $memo->memo_page,
                    'user_name' => $memo->user->name,
                    'is_current_user' => $memo->user_id === $user->id,
                    'created_at' => $memo->created_at->format('Y-m-d'),
                ];
            });

        return response()->json($memos);
    }
}

```

route/web.php```
<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\BookSearchController;
use App\Http\Controllers\FavoriteBookController;
use App\Http\Controllers\MemoController;
use App\Models\BookShelf;
use App\Http\Controllers\BookShelfController;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::middleware('auth')->group(function () {

    // ページルート
    Route::get('/favorite-book/list', [FavoriteBookController::class, 'index'])->name('favorite.index');
    Route::get('/memo/list',  [MemoController::class, 'index'])->name('memos.index');
    Route::get('/book/search', [BookSearchController::class, 'index'])->name('book.search');

    Route::get('/book-shelf/list', function () {
        return Inertia::render('BookShelf/BookShelfList');
    })->name('book-shelf.list');
    Route::get('/book-shelf/detail', function () {
        return Inertia::render('BookShelf/BookShelfDetail');
    })->name('book-shelf.detail');
    Route::get('/book-shelf/{book_shelf_id}', [BookShelfController::class, 'show'])->name('book-shelf.detail');

    // 書籍処理
    Route::prefix('books')->group(function () {
        // お気に入り処理
        Route::post('/toggle-favorite', [FavoriteBookController::class, 'toggleFavorite'])->name('favorite.toggle');
        Route::get('/favorite-status', [FavoriteBookController::class, 'getFavoriteStatus'])->name('favorite.stauts');
        // 書籍ステータス処理
        Route::post('/update-status', [FavoriteBookController::class, 'updateReadStatus'])->name('books.stauts');
    });
    // 書籍のメモを取得
    Route::get('/book/{isbn}/memos', [MemoController::class, 'getBookMemos'])->name('book.memos');

    // メモ処理
    Route::prefix('memo')->group(function () {
        Route::post('/create', [MemoController::class, 'store'])->name('memo.store');
        Route::put('/{memo_id}', [MemoController::class, 'update'])->name('memo.update');
        Route::delete('/{memo_id}', [MemoController::class, 'destroy'])->name('memo.destroy');
    });

    // 本棚処理
    Route::prefix('book-shelf')->group(function () {
        Route::post('/create', [BookShelfController::class, 'store'])->name('book-shelf.store');
        Route::get('/get/mylist', [BookShelfController::class, 'getMyAll'])->name('book-shelf.get.mylist');
        Route::get('/get/books', [BookShelfController::class, 'getBooks'])->name('book-shelf.get.books');
        Route::post('/add/books', [BookShelfController::class, 'addBooks'])->name('book-shelf.add.books');
        Route::post('/{isbn}', [BookShelfController::class, 'removeBook'])->name('book-shelf.remove.book');
    });

    // プロフィール処理
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/privacy', function () {
    return Inertia::render('PrivacyPolicy');
})->name('privacy');

require __DIR__ . '/auth.php';

```

/home/hsgw28/develop/minelibrary/database/migrations
2025_02_19_094659_create_books_table.php```
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->string('isbn')->primary();
            $table->string('title');
            $table->string('author');
            $table->string('publisher_name');
            $table->string('sales_date');
            $table->text('item_caption');
            $table->integer('item_price');
            $table->string('image_url');
            $table->timestamps();
        });

        Schema::table('books', function (Blueprint $table) {
            $table->index('isbn');
            $table->index('updated_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};

```
2025_02_19_100102_create_book_shelves_table.php```
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('book_shelves', function (Blueprint $table) {
            $table->id();
            $table->string('book_shelf_name');
            $table->text('description');
            $table->foreignId('user_id')->constrained();
            $table->boolean('is_public');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('book_shelves');
    }
};

```
2025_02_19_100216_create_favorite_books_table.php```
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\ReadStatus;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('favorite_books', function (Blueprint $table) {
            $table->id();
            $table->string('isbn');
            $table->foreignId('user_id')
                ->constrained()
                ->onDelete('cascade');
            $table->enum('read_status', array_column(ReadStatus::cases(), 'value'))
                ->default(ReadStatus::WANTREAD->value);
            $table->timestamps();

            $table->foreign('isbn')
                ->references('isbn')
                ->on('books')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('favorite_books');
    }
};

```
2025_02_19_100240_create_memos_table.php```
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('memos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->constrained()
                ->onDelete('cascade');
            $table->string('isbn');
            $table->text('memo');
            $table->unsignedInteger('memo_chapter')->nullable();
            $table->unsignedInteger('memo_page')->nullable();
            $table->timestamps();

            $table->foreign('isbn')
                ->references('isbn')
                ->on('books')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('memos');
    }
};

```

## FRONT END

Components/```

    Book/```
        BookCard```
        import FavoriteIcon from '@/Components/Icon/FavoriteIcon';
import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/card';
import { BookDetailDialog } from '@/Dialog/Book/BookDetailDialog';
import { UpdateReadStatusDialog } from '@/Dialog/Book/UpdateReadStatusDialog';
import { CreateMemoDialog } from '@/Dialog/Memo/CreateMemoDialog';
import { BookProps, ReadStatus } from '@/types';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { Book, BookOpen, Edit, Heart, Library, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ReadStatusBadge } from './ReadStatusBadge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/Components/ui/dropdown-menu';
import { CreateBookShelfDialog } from '@/Dialog/BookShelf/CreateBookShelf';
import { DeleteBookShelfDialog } from '@/Dialog/BookShelf/DeleteBookShelfDialog';
import { DeleteBookDialog } from '@/Dialog/BookShelf/DeleteBookDialog';

interface UnifiedBookCardProps extends BookProps {
  variant?: 'favorite' | 'default' | 'book-shelf';
  book_shelf_id?: number;
}

export default function BookCard({
  title,
  author,
  publisher_name,
  sales_date,
  item_price,
  isbn,
  image_url,
  item_caption,
  variant = 'default',
  readStatus,
  book_shelf_id
}: UnifiedBookCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [detailBookDialogOpen, setDetailBookDialogOpen] = useState(false);
  const [readStatusDialogOpen, setReadStatusDialogOpen] = useState(false);
  const [createBookShelfDialogOpen, setCreateBookShelfDialogOpen] = useState(false);
  const [deleteBookDialogOpen, setDeleteBookDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ReadStatus>(
    readStatus ?? 'want_read',
  );
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [bookshelves, setBookshelves] = useState<{ id: number; book_shelf_name: string }[]>([]);

  const getBookShelves = () => {
    axios.get('/book-shelf/get/mylist')
      .then(response => {
        setBookshelves(response.data);
      })
      .catch(error => {
        console.error('Failed to fetch bookshelves:', error);
      });
  }
  useEffect(() => {
    getBookShelves();
  }, []);

  const handleDetailBook = () => setDetailBookDialogOpen(true);
  const confirmDetailBook = () => setDetailBookDialogOpen(false);

  useEffect(() => {
    axios
      .get('/books/favorite-status', { params: { isbn } })
      .then((response) => setIsFavorite(response.data.isFavorite));
  }, [isbn]);

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    axios.post('/books/toggle-favorite', {
      isbn,
      title,
      author,
      publisher_name,
      sales_date,
      image_url,
      item_caption,
      item_price,
    });
  };

  const confirmBookShelfCreate = async (
    BookShelfName: string,
    Discription: string,
  ) => {
    const req = await axios.post(`/book-shelf/create`, {
      book_shelf_name: BookShelfName,
      description: Discription,
    });
    console.log(req);
    setCreateDialogOpen(false);
    getBookShelves(); // 本棚リストを再取得
  }

  const confirmBookDelete = async () => {
    try {
      await axios.post('/book-shelf/remove-book', {
        book_shelf_id: book_shelf_id,
        isbn: isbn
      });
      router.reload();
    } catch (error) {
      console.error('Failed to remove book from shelf:', error);
    }
  };

  const confirmCreate = async (
    memo: string,
    chapter?: number,
    page?: number,
  ) => {
    try {
      await axios.post('/memo/create', {
        isbn: isbn,
        memo,
        memo_chapter: chapter,
        memo_page: page,
      });
      router.reload();
    } catch (error) {
      console.error('Failed to create memo:', error);
    }
    setCreateDialogOpen(false);
  };

  const updateReadStatus = (readStatus: ReadStatus) => {
    setReadStatusDialogOpen(false);
    axios.post('/books/update-status', {
      isbn,
      readStatus: readStatus,
    });
  };

  return (
    <Card
      className={`mx-auto w-full ${variant === 'favorite' || variant === 'book-shelf' ? 'p-4' : 'max-w-4xl overflow-hidden p-4 md:p-6'}`}
    >
      <div
        className={
          variant === 'favorite' || variant === 'book-shelf'
            ? 'relative grid gap-4 sm:grid-cols-[200px_1fr]'
            : 'flex flex-col gap-4 md:flex-row lg:flex-col'
        }
      >
        {variant === 'favorite' || variant === 'book-shelf' && selectedStatus && (
          <ReadStatusBadge status={selectedStatus} />
        )}

        <div
          className={`mx-auto aspect-[3/4] w-full max-w-[200px] overflow-hidden rounded-md border-2 border-gray-200 shadow-lg ${variant === 'favorite' || variant === 'book-shelf' ? '' : 'shrink-0'
            }`}
        >
          <img
            src={image_url || '/placeholder.svg'}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>

        <div
          className={`flex flex-col justify-between ${variant === 'favorite' || variant === 'book-shelf' ? 'space-y-4' : 'flex-1 space-y-4'
            }`}
        >
          <div className="space-y-2">
            <div className="flex">
              <h2
                className={`${variant === 'favorite' || variant === 'book-shelf'
                  ? 'text-xl font-bold sm:text-2xl'
                  : 'w-full truncate text-xl font-bold sm:text-left sm:text-2xl'
                  }`}
              >
                {title}
              </h2>
              <div
                className={`${variant === 'favorite' || variant === 'book-shelf' ? 'hidden md:block md:w-28' : ''}`}
              ></div>
            </div>
            <div
              className={`text-sm text-muted-foreground ${variant === 'favorite' || variant === 'book-shelf' ? 'space-y-1' : 'space-y-1 sm:text-left'
                }`}
            >
              <p className={variant === 'default' ? 'w-full truncate' : ''}>
                {`${sales_date} / ${author} / ${publisher_name}`}
              </p>
              {variant === 'default' && (
                <p className="text-lg font-semibold text-red-600">
                  ¥{item_price.toLocaleString()}
                </p>
              )}
            </div>
          </div>

          {variant === 'favorite' || variant === 'book-shelf' ? (
            <>
              <div className="grid gap-2 sm:grid-cols-2">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => setReadStatusDialogOpen(true)}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>進捗を変更</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  size="lg"
                  onClick={() => setCreateDialogOpen(true)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">メモを書く</span>
                  <span className="sm:hidden">メモ</span>
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleDetailBook}
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                >
                  <Book className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">詳細を見る</span>
                  <span className="sm:hidden">詳細</span>
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={handleFavoriteClick}
                >
                  <Heart
                    className={`mr-2 h-4 w-4 ${isFavorite ? 'fill-current' : ''}`}
                  />
                  <p className="hidden sm:inline">{isFavorite ? 'お気に入り解除' : 'お気に入り'}</p>
                  <p className="sm:hidden">{isFavorite ? '解除' : '追加'}</p>

                </Button>

                {variant !== 'book-shelf' && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="sm" className="flex-1">
                        <Library className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">本棚に追加</span>
                        <span className="sm:hidden">追加</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      {bookshelves.map((shelf) => (
                        <DropdownMenuItem
                          key={shelf.id}
                          className="truncate items-center flex"
                          onClick={() => {
                            axios.post('/book-shelf/add/books', {
                              book_shelf_id: shelf.id,
                              isbns: [isbn]
                            });
                          }}
                        >
                          <Library />
                          {shelf.book_shelf_name.length > 12
                            ? shelf.book_shelf_name.slice(0, 12) + '...'
                            : shelf.book_shelf_name}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuItem
                        className='items-center flex'
                        onClick={() => setCreateBookShelfDialogOpen(true)}
                      >
                        <Plus />
                        本棚を作成
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                {variant !== 'favorite' && (
                  <Button variant="secondary" size="sm" className="flex-1" onClick={() => setDeleteBookDialogOpen(true)}>
                    <Library className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">本棚から削除する</span>
                    <span className="sm:hidden">削除</span>
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button onClick={handleDetailBook} className="w-full">
                詳細を見る
              </Button>
              <FavoriteIcon
                isFavorite={isFavorite}
                onClick={handleFavoriteClick}
              />
            </div>
          )}

        </div>

        {readStatus && (
          <UpdateReadStatusDialog
            isOpen={readStatusDialogOpen}
            onClose={() => setReadStatusDialogOpen(false)}
            readStatus={selectedStatus}
            onChangeValue={setSelectedStatus}
            onConfirm={() => updateReadStatus(selectedStatus)}
          />
        )}

        <BookDetailDialog
          title={title}
          author={author}
          publisher_name={publisher_name}
          sales_date={sales_date}
          item_price={item_price}
          isbn={isbn}
          image_url={image_url}
          isOpen={detailBookDialogOpen}
          onClose={() => setDetailBookDialogOpen(false)}
          onConfirm={confirmDetailBook}
          item_caption={item_caption}
        />
        <CreateMemoDialog
          isOpen={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onMemoConfirm={confirmCreate}
          isbn={isbn}
        />
        <CreateBookShelfDialog
          isOpen={createBookShelfDialogOpen}
          onClose={() => setCreateBookShelfDialogOpen(false)}
          onCreateBookShelfConfirm={confirmBookShelfCreate}
        />

        <DeleteBookDialog
          isOpen={deleteBookDialogOpen}
          onClose={() => setDeleteBookDialogOpen(false)}
          onDeleteBookConfirm={confirmBookDelete}
        />
      </div>
    </Card>
  );
}

        ```
    
    ```
    /BookShelf```
        BookShelfDescription```
        
        import { Separator } from '@/Components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { BookPlus, MoreVertical, Pencil, Share, Trash } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { EditBookShelfDialog } from '@/Dialog/BookShelf/EditBookShelfDialog';
import { DeleteBookShelfDialog } from '@/Dialog/BookShelf/DeleteBookShelfDialog';
import { useState } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';

export default function BookShelfDescription({ name, description, isPublic, bookShelfId }: any) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleEdit = () => {
    setEditDialogOpen(true);
  };

  const confirmEdit = async (newName: string, newDescription: string, newIsPublic: boolean) => {
    try {
      await axios.put(`/book-shelf/update/${bookShelfId}`, {
        book_shelf_name: newName,
        description: newDescription,
        is_public: newIsPublic
      });
      router.reload();
    } catch (error) {
      console.error('Failed to update bookshelf:', error);
    }
    setEditDialogOpen(false);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/book-shelf/delete/${bookShelfId}`);
      router.visit('/book-shelf');
    } catch (error) {
      console.error('Failed to delete bookshelf:', error);
    }
    setDeleteDialogOpen(false);
  };

  const handleShare = () => {
    // 共有機能の実装（今回は省略）
    console.log('Share bookshelf');
  };

  const handleAddBook = () => {
    // 本を追加する機能の実装（今回は省略）
    console.log('Add book to bookshelf');
  };

  return (
    <div className="rounded-sm border border-green-600 bg-white shadow-md min-h-40 mt-4 px-4 py-2 md:py-4">
      <div className="flex items-center justify-between">
        <p className="font-bold text-2xl">{name}</p>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem onClick={handleAddBook}>
              <BookPlus className="mr-2 h-4 w-4" />
              本を追加する
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              本棚を編集する
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShare}>
              <Share className="mr-2 h-4 w-4" />
              本棚を共有する
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>
              <Trash className="mr-2 h-4 w-4" />
              本棚を削除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p className="text-md mt-1 text-gray-700">{description}</p>
      <Separator className="my-4" />

      <div className="flex items-center">
        <img className='w-9 h-9 rounded-3xl' src="https://placehold.jp/150x150.png" alt="" />
        <p className="ml-2 md:ml-4 text-md font-semibold text-gray-600">ユーザー名</p>
      </div>

      <EditBookShelfDialog
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onEditBookShelfConfirm={confirmEdit}
        initialName={name}
        initialDescription={description}
        initialIsPublic={isPublic}
      />

      <DeleteBookShelfDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}


        ```

    ```

```

Dialog/```

    BookShelf/```
        AddBookDialog```
import React, { useState } from 'react';
import { Button } from "@/Components/ui/button";
import {
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { BaseDialog } from '@/Dialog/BaseDialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Checkbox } from "@/Components/ui/checkbox";
import { ReadStatus } from '@/types';

type Book = {
  isbn: string;
  title: string;
  author: string;
  publish_date: string;
  read_status: ReadStatus;
};

const statusConfig = {
  want_read: {
    text: '読みたい',
  },
  reading: {
    text: '読んでる',
  },
  done_read: {
    text: '読んだ',
  },
};

const data: Book[] = [
  {
    isbn: "9784123456789",
    title: "React入門",
    author: "山田太郎",
    publish_date: "2023-01-01",
    read_status: "done_read",
  },
  {
    isbn: "9784987654321",
    title: "TypeScript実践ガイド",
    author: "鈴木花子",
    publish_date: "2023-02-15",
    read_status: "done_read",
  },
  {
    isbn: "9784567890123",
    title: "Next.js開発入門",
    author: "佐藤次郎",
    publish_date: "2023-03-30",
    read_status: "reading",
  },
];

function DataTable({ data, onSelect }: { data: Book[], onSelect: (isbn: string, isChecked: boolean) => void }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>書籍タイトル</TableHead>
            <TableHead>読書ステータス</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((book) => (
            <TableRow key={book.isbn}>
              <TableCell>
                <Checkbox
                  onCheckedChange={(checked) => onSelect(book.isbn, checked as boolean)}
                />
              </TableCell>
              <TableCell>{book.title}</TableCell>
              <TableCell>{statusConfig[book.read_status].text}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function AddBookDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);

  const handleClose = () => setIsOpen(false);

  const handleSelect = (isbn: string, isChecked: boolean) => {
    setSelectedBooks(prev =>
      isChecked
        ? [...prev, isbn]
        : prev.filter(selectedIsbn => selectedIsbn !== isbn)
    );
  };

  const handleAddBooks = () => {
    console.log('Selected books:', selectedBooks);
    handleClose();
  };

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>本棚に追加</Button>
      <BaseDialog isOpen={isOpen} onClose={handleClose}>
        <DialogHeader>
          <DialogTitle>本棚に書籍を追加</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <DataTable data={data} onSelect={handleSelect} />
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={handleAddBooks}>選択した本を追加</Button>
        </div>
      </BaseDialog>
    </>
  );
}

        ```
        CreateMemoDialog```
import { Button } from '@/Components/ui/button';
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { DialogProps } from '@/types';
import { useState } from 'react';
import { BaseDialog } from '../BaseDialog';

interface CreateMemoDialogProps extends DialogProps {
  isbn: string;
  onMemoConfirm: (memo: string, chapter?: number, page?: number) => void;
}

export function CreateMemoDialog({
  isOpen,
  onClose,
  onMemoConfirm,
}: CreateMemoDialogProps) {
  const [chapter, setChapter] = useState<string>('');
  const [page, setPage] = useState<string>('');
  const [memo, setMemo] = useState<string>('');

  const handleConfirm = () => {
    onMemoConfirm(
      memo,
      Number(chapter) || undefined,
      Number(page) || undefined,
    );
    setChapter('');
    setPage('');
    setMemo('');
    onClose();
  };

  return (
    <BaseDialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>作成</DialogTitle>
      </DialogHeader>
      <DialogDescription>
        感想や印象に残ったことをメモしよう！
      </DialogDescription>
      <div className="flex w-full flex-col">
        <div className="mt-2 grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="chapter">章（任意）</Label>
          <Input
            type="number"
            id="chapter"
            placeholder="chapter"
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
          />
        </div>
        <div className="mt-2 grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="page">ページ（任意）</Label>
          <Input
            type="number"
            id="page"
            placeholder="page"
            value={page}
            onChange={(e) => setPage(e.target.value)}
          />
        </div>
        <div className="mt-2 grid items-center gap-1.5 text-left">
          <Label className="mb-1" htmlFor="memo">
            Memo
          </Label>
          <Textarea
            id="memo"
            placeholder="Memo"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </div>
        <div className="mt-6 flex justify-end">
          <Button type="submit" className="mr-4" onClick={handleConfirm}>
            作成
          </Button>
          <Button variant="destructive" onClick={onClose}>
            キャンセル
          </Button>
        </div>
      </div>
    </BaseDialog>
  );
}

        ```
    ```

```

Page/```

    BookShelfDetail```
import { useEffect, useState } from 'react';
import BookCard from '@/Components/Book/BookCard';
import BookShelfDescription from '@/Components/BookShelf/BookShelfDescription';
import { AddBookDialog } from '@/Dialog/BookShelf/AddBookDialog';
import DefaultLayout from '@/Layouts/DefaultLayout';
import { Head } from '@inertiajs/react';

interface BookShelfDetailProps {
  bookShelf: {
    id: number;
    book_shelf_name: string;
    description: string;
    is_public: boolean;
  };
  books: any[];
}

export default function BookShelfDetail({ bookShelf, books }: BookShelfDetailProps) {
  return (
    <DefaultLayout header="本棚詳細">
      <Head title={bookShelf.book_shelf_name} />
      <BookShelfDescription
        name={bookShelf.book_shelf_name}
        description={bookShelf.description}
      // isPublic={bookShelf.is_public}
      />
      <div className="mt-8 grid grid-cols-1 gap-y-4">
        {books && books.length > 0 ? (
          books.map((item: any) => (
            <BookCard
              key={item.isbn}
              title={item.book.title}
              author={item.book.author}
              publisher_name={item.book.publisher_name || ''}
              sales_date={item.book.sales_date}
              image_url={item.book.image_url || ''}
              item_price={item.book.item_price}
              isbn={item.isbn}
              item_caption={item.book.item_caption || '説明はありません。'}
              variant="book-shelf"
              readStatus={item.read_status}
              book_shelf_id={bookShelf.id}
            />
          ))
        ) : (
          <p className="font-bold">本棚に書籍はありません</p>
        )}
      </div>
    </DefaultLayout>
  );
}

    ```

```
