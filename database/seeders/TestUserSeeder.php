<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Book;
use App\Models\FavoriteBook;
use Illuminate\Support\Facades\Hash;

class TestUserSeeder extends Seeder
{
    public function run()
    {
        // テストユーザーを作成
        $user = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
                'email_verified_at' => now()
            ]
        );

        // テスト書籍を作成
        $books = [
            [
                'isbn' => '9784123456789',
                'title' => 'テスト書籍1',
                'author' => 'テスト著者1',
                'publisher_name' => 'テスト出版社',
                'sales_date' => '2024-01-01',
                'image_url' => 'https://example.com/image1.jpg',
                'item_caption' => 'テスト書籍1の説明です。',
                'item_price' => 1500
            ],
            [
                'isbn' => '9784123456790',
                'title' => 'テスト書籍2',
                'author' => 'テスト著者2',
                'publisher_name' => 'テスト出版社',
                'sales_date' => '2024-02-01',
                'image_url' => 'https://example.com/image2.jpg',
                'item_caption' => 'テスト書籍2の説明です。',
                'item_price' => 2000
            ]
        ];

        foreach ($books as $bookData) {
            $book = Book::firstOrCreate(
                ['isbn' => $bookData['isbn']],
                $bookData
            );
            
            // お気に入りに追加
            FavoriteBook::firstOrCreate([
                'isbn' => $book->isbn,
                'user_id' => $user->id,
                'read_status' => 'want_read'
            ]);
        }

        $this->command->info('Test user and favorite books created successfully.');
    }
}