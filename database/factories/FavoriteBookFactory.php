<?php

namespace Database\Factories;

use App\Models\FavoriteBook;
use App\Models\User;
use App\Models\Book;
use App\Enums\ReadStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FavoriteBook>
 */
class FavoriteBookFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = FavoriteBook::class;

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
            'read_status' => $this->faker->randomElement([
                ReadStatus::WANTREAD->value,
                ReadStatus::READING->value,
                ReadStatus::DONEREAD->value,
            ]),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    /**
     * 読みたい状態で作成
     *
     * @return static
     */
    public function wantRead(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'read_status' => ReadStatus::WANTREAD->value,
            ];
        });
    }

    /**
     * 読書中状態で作成
     *
     * @return static
     */
    public function reading(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'read_status' => ReadStatus::READING->value,
            ];
        });
    }

    /**
     * 読了状態で作成
     *
     * @return static
     */
    public function doneRead(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'read_status' => ReadStatus::DONEREAD->value,
            ];
        });
    }

    /**
     * 特定のユーザーのお気に入りとして作成
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
     * 特定の本のお気に入りとして作成
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
}