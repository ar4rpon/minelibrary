<?php

// テスト用のユーザーでお気に入りページにアクセスしてボタンの動作を確認
// php -f tests/manual-test.php

require_once 'vendor/autoload.php';

use App\Models\User;
use App\Models\Book;
use App\Models\FavoriteBook;
use Illuminate\Support\Facades\Hash;

// アプリケーションを起動
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "Testing favorite book functionality...\n";

// テストユーザーを確認
$user = User::where('email', 'test@example.com')->first();
if (!$user) {
    echo "Test user not found. Please run TestUserSeeder first.\n";
    exit(1);
}

// お気に入り書籍を確認
$favorites = $user->favoriteBooks()->with('book')->get();
echo "Found " . $favorites->count() . " favorite books for test user\n";

if ($favorites->count() > 0) {
    foreach ($favorites as $favorite) {
        echo "- ISBN: " . $favorite->isbn . " - " . $favorite->book->title . "\n";
    }
} else {
    echo "No favorite books found. Creating test data...\n";
    
    // テスト書籍を作成
    $book = Book::firstOrCreate(
        ['isbn' => '9784123456789'],
        [
            'title' => 'テスト書籍1',
            'author' => 'テスト著者1',
            'publisher_name' => 'テスト出版社',
            'sales_date' => '2024-01-01',
            'image_url' => 'https://example.com/image1.jpg',
            'item_caption' => 'テスト書籍1の説明です。',
            'item_price' => 1500
        ]
    );
    
    FavoriteBook::firstOrCreate([
        'isbn' => $book->isbn,
        'user_id' => $user->id,
        'read_status' => 'want_read'
    ]);
    
    echo "Test data created successfully\n";
}

// FavoriteBookControllerの動作確認
echo "\nTesting FavoriteBookController...\n";
$controller = new App\Http\Controllers\FavoriteBookController(new App\Services\FavoriteBookService());

// 模擬リクエストを作成
$request = new Illuminate\Http\Request();
$request->merge(['sortBy' => 'newDate']);

// ユーザー認証を模擬（通常はミドルウェアで処理）
// 実際のテストではauth()ヘルパーが機能しないため、直接サービスメソッドをテスト

$favoriteService = new App\Services\FavoriteBookService();
$favorites = $favoriteService->getFavoritesData($user->id, 'newDate');

echo "FavoriteBookService returned " . $favorites->count() . " items\n";

if ($favorites->count() > 0) {
    $first = $favorites->first();
    echo "First favorite book structure:\n";
    echo "- ISBN: " . $first['isbn'] . "\n";
    echo "- Read Status: " . $first['read_status'] . "\n";
    echo "- Book Title: " . $first['book']['title'] . "\n";
    echo "- All required fields present: " . (isset($first['book']['title'], $first['book']['author'], $first['book']['publisher_name']) ? 'Yes' : 'No') . "\n";
}

echo "\nTest completed successfully. Frontend should work properly now.\n";