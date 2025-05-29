<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\BookShelf;
use App\Models\User;
use App\Models\FavoriteBook;
use App\Models\FavoriteBookShelf;
use Illuminate\Database\Seeder;

class TestBookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // テストユーザーの作成
        $testUser = User::factory()->create([
            'email' => 'test@example.com',
            'name' => 'テストユーザー',
        ]);

        $otherUser = User::factory()->create([
            'email' => 'other@example.com',
            'name' => '他のユーザー',
        ]);

        // プログラミング本の作成
        $programmingBooks = [
            [
                'isbn' => '9784798151090',
                'title' => 'PHPフレームワーク Laravel入門',
                'author' => '掌田津耶乃',
                'publisher_name' => '秀和システム',
                'item_price' => 3300,
            ],
            [
                'isbn' => '9784295013990',
                'title' => 'TypeScript実践プログラミング',
                'author' => 'Steve Fenton',
                'publisher_name' => 'インプレス',
                'item_price' => 3520,
            ],
            [
                'isbn' => '9784873119380',
                'title' => 'リーダブルコード',
                'author' => 'Dustin Boswell, Trevor Foucher',
                'publisher_name' => 'オライリージャパン',
                'item_price' => 2640,
            ],
        ];

        foreach ($programmingBooks as $bookData) {
            Book::factory()->create($bookData);
        }

        // ランダムな本を追加生成
        Book::factory()->count(10)->programming()->create();
        Book::factory()->count(5)->novel()->create();
        Book::factory()->count(5)->business()->create();

        // テストユーザーの本棚作成
        $myShelf = BookShelf::factory()->forUser($testUser)->create([
            'book_shelf_name' => '私のプログラミング本棚',
            'description' => 'プログラミング学習に使っている本のコレクション',
            'is_public' => true,
        ]);

        $privateShelf = BookShelf::factory()->forUser($testUser)->private()->create([
            'book_shelf_name' => '非公開の読書リスト',
            'description' => '個人的な読書記録',
        ]);

        // 他のユーザーの公開本棚
        $otherPublicShelf = BookShelf::factory()->forUser($otherUser)->public()->create([
            'book_shelf_name' => 'おすすめビジネス書',
            'description' => '仕事に役立つビジネス書を紹介',
        ]);

        // 本棚に本を追加
        $allBooks = Book::all();
        
        // プログラミング本棚に本を追加
        $myShelf->books()->attach(
            Book::whereIn('isbn', array_column($programmingBooks, 'isbn'))->pluck('isbn')
        );

        // 非公開本棚にランダムな本を追加
        $privateShelf->books()->attach(
            $allBooks->random(5)->pluck('isbn')
        );

        // 他のユーザーの本棚にビジネス書を追加
        $otherPublicShelf->books()->attach(
            Book::factory()->count(5)->business()->create()->pluck('isbn')
        );

        // お気に入り本の設定
        FavoriteBook::create([
            'user_id' => $testUser->id,
            'isbn' => '9784873119380', // リーダブルコード
            'read_status' => 'read',
        ]);

        FavoriteBook::create([
            'user_id' => $testUser->id,
            'isbn' => '9784798151090', // Laravel入門
            'read_status' => 'reading',
        ]);

        // お気に入り本棚の設定
        FavoriteBookShelf::create([
            'user_id' => $testUser->id,
            'book_shelf_id' => $otherPublicShelf->id,
        ]);

        $this->command->info('Test data seeded successfully!');
    }
}