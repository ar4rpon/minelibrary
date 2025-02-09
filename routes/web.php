<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/favoritebooklist', function () {
    return Inertia::render('FavoriteBookList');
})->middleware(['auth', 'verified'])->name('favoritebooklist');
Route::get('/bookshelflist', function () {
    return Inertia::render('BookShelf/BookShelfList');
})->middleware(['auth', 'verified'])->name('bookshelflist');
Route::get('/bookshelfdetail', function () {
    return Inertia::render('BookShelf/BookShelfDetail');
})->middleware(['auth', 'verified'])->name('bookshelfdetail');
Route::get('/memolist', function () {
    return Inertia::render('MemoList');
})->middleware(['auth', 'verified'])->name('memolist');
Route::get('/searchbook', function () {
    return Inertia::render('SearchBook');
})->middleware(['auth', 'verified'])->name('searchbook');

Route::get('/privacy', function () {
    return Inertia::render('PrivacyPolicy');
})->middleware(['auth', 'verified'])->name('privacy');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
