<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RakutenBooksController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/booklist', function () {
    return Inertia::render('BookList');
})->middleware(['auth', 'verified'])->name('booklist');

Route::get('/testpage', function () {
    $rakutenController = new RakutenBooksController();
    $data = $rakutenController->basic_request();
    return Inertia::render('TestPage', [
        'data' => $data
    ]);
})->middleware(['auth', 'verified'])->name('testpage');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/test', [RakutenBooksController::class, 'basic_request']);

require __DIR__ . '/auth.php';
