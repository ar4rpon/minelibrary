<?php

use App\Http\Controllers\BookSearchController;
use App\Http\Controllers\BookShelfController;
use App\Http\Controllers\FavoriteBookController;
use App\Http\Controllers\FavoriteBookShelfController;
use App\Http\Controllers\MemoController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ShareLinkController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// トップページ
Route::get('/', function () {
    if (Auth::check()) {
        return redirect('/dashboard');
    }
    return Inertia::render('Welcome');
});

// ダッシュボード
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth'])->name('app-guide');

// 認証が必要なページルート
Route::middleware('auth')->group(function () {
    
    // 各種一覧・詳細ページ
    Route::get('/favorite-book/list', [FavoriteBookController::class, 'index'])->name('favorite.index');
    Route::get('/memo/list', [MemoController::class, 'index'])->name('memos.index');
    Route::get('/book/search', [BookSearchController::class, 'index'])->name('book.search');
    
    Route::get('/book-shelf/list', [BookShelfController::class, 'index'])->name('book-shelf.list');
    Route::get('/book-shelf/{book_shelf_id}', [BookShelfController::class, 'show'])->name('book-shelf.detail');
    Route::get('/favorite-book-shelf/list', [FavoriteBookShelfController::class, 'index'])->name('favorite-book-shelf.index');

    // プロフィール関連ページ
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    
    // 本棚作成API (Webルートとして追加)
    Route::post('/book-shelf/create', [BookShelfController::class, 'store'])->name('book-shelf.create');

    // 他のユーザーのプロフィール・本棚表示
    Route::get('/user/{userId}/profile', [ProfileController::class, 'showUser'])->name('user.profile');
    Route::get('/user/{userId}/book-shelves', [BookShelfController::class, 'userBookShelves'])->name('user.book-shelves');
    Route::get('/user/{userId}/book-shelf/{bookShelfId}', [BookShelfController::class, 'userBookShelf'])->name('user.book-shelf');
});

// 公開ページ（認証不要）
Route::get('/shared-booklist/{token}', [ShareLinkController::class, 'showSharedBookShelf'])
    ->name('shared-booklist');

// 公開API（認証不要）
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