<?php

namespace Database\Factories;

use App\Models\FavoriteBookShelf;
use App\Models\User;
use App\Models\BookShelf;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FavoriteBookShelf>
 */
class FavoriteBookShelfFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = FavoriteBookShelf::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'book_shelf_id' => BookShelf::factory(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
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
     * 特定の本棚のお気に入りとして作成
     *
     * @param BookShelf $bookShelf
     * @return static
     */
    public function forBookShelf(BookShelf $bookShelf): static
    {
        return $this->state(function (array $attributes) use ($bookShelf) {
            return [
                'book_shelf_id' => $bookShelf->id,
            ];
        });
    }
}