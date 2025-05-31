<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\BookSearchController;
use App\Http\Controllers\FavoriteBookController;
use App\Http\Controllers\FavoriteBookShelfController;
use App\Http\Controllers\MemoController;
use App\Models\BookShelf;
use App\Http\Controllers\BookShelfController;
use App\Http\Controllers\ShareLinkController;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

Route::get('/', function () {
    if (Auth::check()) {
        return redirect('/dashboard');
    }
    return Inertia::render('Welcome');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth'])->name('app-guide');

Route::middleware('auth')->group(function () {

    // ページルート
    Route::get('/favorite-book/list', [FavoriteBookController::class, 'index'])->name('favorite.index');
    Route::get('/memo/list',  [MemoController::class, 'index'])->name('memos.index');
    Route::get('/book/search', [BookSearchController::class, 'index'])->name('book.search');

    Route::get('/book-shelf/list', [BookShelfController::class, 'index'])->name('book-shelf.list');
    Route::get('/book-shelf/{book_shelf_id}', [BookShelfController::class, 'show'])->name('book-shelf.detail');
    Route::get('/favorite-book-shelf/list', [FavoriteBookShelfController::class, 'index'])->name('favorite-book-shelf.index');

    // 書籍処理
    Route::prefix('books')->group(function () {
        // お気に入り処理
        Route::post('/toggle-favorite', [FavoriteBookController::class, 'toggleFavorite'])->name('favorite.toggle');
        Route::get('/favorite-status', [FavoriteBookController::class, 'getFavoriteStatus'])->name('favorite.status');
        // 書籍ステータス処理
        Route::post('/update-status', [FavoriteBookController::class, 'updateReadStatus'])->name('books.status');
    });

    // 本棚お気に入り処理
    Route::prefix('book-shelf-favorite')->group(function () {
        Route::post('/toggle', [FavoriteBookShelfController::class, 'toggleFavorite'])->name('book-shelf-favorite.toggle');
        Route::get('/status', [FavoriteBookShelfController::class, 'getFavoriteStatus'])->name('book-shelf-favorite.status');
    });


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
        Route::get('/get/favorite-books', [FavoriteBookController::class, 'getFavorites'])->name('book-shelf.get.favorite.books');
        Route::post('/add/books', [BookShelfController::class, 'addBooks'])->name('book-shelf.add.books');
        Route::put('/update/{id}', [BookShelfController::class, 'update'])->name('book-shelf.update.book');
        Route::delete('/delete/{id}', [BookShelfController::class, 'destroy'])->name('book-shelf.destroy');
        Route::post('/generate-share-link', [ShareLinkController::class, 'generateShareLink'])->name('book-shelf.generate-share-link');
        Route::post('/{isbn}', [BookShelfController::class, 'removeBook'])->name('book-shelf.remove.book');
    });


    // プロフィール処理
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // 他のユーザーのプロフィール表示
    Route::get('/user/{userId}/profile', [ProfileController::class, 'showUser'])->name('user.profile');

    // 他のユーザーの本棚
    Route::get('/user/{userId}/book-shelves', [BookShelfController::class, 'userBookShelves'])->name('user.book-shelves');
    Route::get('/user/{userId}/book-shelf/{bookShelfId}', [BookShelfController::class, 'userBookShelf'])->name('user.book-shelf');
});



// 共有リンク
Route::get('/shared-booklist/{token}', [ShareLinkController::class, 'showSharedBookShelf'])
    ->name('shared-booklist');
// 書籍のメモを取得
Route::get('/book/{isbn}/memos', [MemoController::class, 'getBookMemos'])->name('book.memos');

Route::get('/privacy', function () {
    return Inertia::render('PrivacyPolicy');
})->name('privacy');

// エラーページ
Route::get('/404', function () {
    return Inertia::render('NotFound');
})->name('error.404');

Route::get('/500', function () {
    return Inertia::render('ServerError');
})->name('error.500');

// 存在しないルートへのアクセスを404ページにリダイレクト
Route::fallback(function () {
    return Inertia::render('NotFound');
});

require __DIR__ . '/auth.php';
