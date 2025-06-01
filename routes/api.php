<?php

use App\Http\Controllers\BookShelfController;
use App\Http\Controllers\FavoriteBookController;
use App\Http\Controllers\FavoriteBookShelfController;
use App\Http\Controllers\MemoController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ShareLinkController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth')->group(function () {
    
    // 書籍関連API
    Route::prefix('books')->group(function () {
        Route::post('/toggle-favorite', [FavoriteBookController::class, 'toggleFavorite'])->name('api.favorite.toggle');
        Route::get('/favorite-status', [FavoriteBookController::class, 'getFavoriteStatus'])->name('api.favorite.status');
        Route::post('/update-status', [FavoriteBookController::class, 'updateReadStatus'])->name('api.books.status');
    });

    // 本棚お気に入りAPI
    Route::prefix('book-shelf-favorite')->group(function () {
        Route::post('/toggle', [FavoriteBookShelfController::class, 'toggleFavorite'])->name('api.book-shelf-favorite.toggle');
        Route::get('/status', [FavoriteBookShelfController::class, 'getFavoriteStatus'])->name('api.book-shelf-favorite.status');
    });

    // メモ関連API
    Route::prefix('memo')->group(function () {
        Route::post('/create', [MemoController::class, 'store'])->name('api.memo.store');
        Route::put('/{memo_id}', [MemoController::class, 'update'])->name('api.memo.update');
        Route::delete('/{memo_id}', [MemoController::class, 'destroy'])->name('api.memo.destroy');
    });

    // 本棚関連API
    Route::prefix('book-shelf')->group(function () {
        Route::post('/create', [BookShelfController::class, 'store'])->name('api.book-shelf.store');
        Route::get('/get/mylist', [BookShelfController::class, 'getMyAll'])->name('api.book-shelf.get.mylist');
        Route::get('/get/books', [BookShelfController::class, 'getBooks'])->name('api.book-shelf.get.books');
        Route::get('/get/favorite-books', [FavoriteBookController::class, 'getFavorites'])->name('api.book-shelf.get.favorite.books');
        Route::post('/add/books', [BookShelfController::class, 'addBooks'])->name('api.book-shelf.add.books');
        Route::put('/update/{id}', [BookShelfController::class, 'update'])->name('api.book-shelf.update.book');
        Route::delete('/delete/{id}', [BookShelfController::class, 'destroy'])->name('api.book-shelf.destroy');
        Route::post('/generate-share-link', [ShareLinkController::class, 'generateShareLink'])->name('api.book-shelf.generate-share-link');
        Route::post('/{isbn}', [BookShelfController::class, 'removeBook'])->name('api.book-shelf.remove.book');
    });

    // プロフィール関連API
    Route::patch('/profile', [ProfileController::class, 'update'])->name('api.profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('api.profile.destroy');
});

