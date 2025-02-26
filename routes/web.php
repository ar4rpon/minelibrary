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
