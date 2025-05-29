<?php

namespace Database\Factories;

use App\Models\Book;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Book>
 */
class BookFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Book::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'isbn' => $this->faker->unique()->isbn13(),
            'title' => $this->faker->sentence(3),
            'author' => $this->faker->name(),
            'publisher_name' => $this->faker->company() . '出版',
            'sales_date' => $this->faker->dateTimeBetween('-5 years', 'now')->format('Y-m-d'),
            'item_price' => $this->faker->numberBetween(500, 5000),
            'item_caption' => $this->faker->paragraph(3),
            'image_url' => $this->faker->imageUrl(200, 300, 'books'),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    /**
     * プログラミング関連の本を生成
     *
     * @return static
     */
    public function programming(): static
    {
        return $this->state(function (array $attributes) {
            $languages = ['PHP', 'JavaScript', 'Python', 'Ruby', 'Go', 'Rust', 'TypeScript'];
            $topics = ['入門', '実践', '設計', 'パターン', 'テスト', 'リファクタリング'];
            
            $language = $this->faker->randomElement($languages);
            $topic = $this->faker->randomElement($topics);
            
            return [
                'title' => "{$language} {$topic}",
                'item_caption' => "{$language}の{$topic}について詳しく解説した技術書です。",
            ];
        });
    }

    /**
     * 小説を生成
     *
     * @return static
     */
    public function novel(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'title' => $this->faker->realText(20) . 'の物語',
                'publisher_name' => $this->faker->randomElement(['文藝春秋', '新潮社', '講談社', '集英社']),
                'item_caption' => $this->faker->realText(200),
            ];
        });
    }

    /**
     * ビジネス書を生成
     *
     * @return static
     */
    public function business(): static
    {
        return $this->state(function (array $attributes) {
            $topics = ['マネジメント', 'リーダーシップ', 'マーケティング', '戦略', 'イノベーション'];
            $topic = $this->faker->randomElement($topics);
            
            return [
                'title' => "実践{$topic}の教科書",
                'item_caption' => "{$topic}について、実例を交えながら解説したビジネス書です。",
                'item_price' => $this->faker->numberBetween(1500, 3000),
            ];
        });
    }

    /**
     * 特定のISBNを持つ本を生成
     *
     * @param string $isbn
     * @return static
     */
    public function withIsbn(string $isbn): static
    {
        return $this->state(function (array $attributes) use ($isbn) {
            return [
                'isbn' => $isbn,
            ];
        });
    }
}