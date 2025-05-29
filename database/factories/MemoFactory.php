<?php

namespace Database\Factories;

use App\Models\Memo;
use App\Models\User;
use App\Models\Book;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Memo>
 */
class MemoFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Memo::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'isbn' => Book::factory(),
            'memo' => $this->faker->paragraph(3),
            'memo_chapter' => $this->faker->numberBetween(1, 20),
            'memo_page' => $this->faker->numberBetween(1, 500),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    /**
     * 章情報なしのメモを作成
     *
     * @return static
     */
    public function withoutChapter(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'memo_chapter' => null,
            ];
        });
    }

    /**
     * ページ情報なしのメモを作成
     *
     * @return static
     */
    public function withoutPage(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'memo_page' => null,
            ];
        });
    }

    /**
     * 特定のユーザーのメモとして作成
     *
     * @param User $user
     * @return static
     */
    public function forUser(User $user): static
    {
        return $this->state(function (array $attributes) use ($user) {
            return [
                'user_id' => $user->id,
            ];
        });
    }

    /**
     * 特定の本のメモとして作成
     *
     * @param Book|string $book
     * @return static
     */
    public function forBook($book): static
    {
        $isbn = $book instanceof Book ? $book->isbn : $book;
        
        return $this->state(function (array $attributes) use ($isbn) {
            return [
                'isbn' => $isbn,
            ];
        });
    }

    /**
     * 長いメモを作成
     *
     * @return static
     */
    public function longMemo(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'memo' => $this->faker->realText(800),
            ];
        });
    }
}