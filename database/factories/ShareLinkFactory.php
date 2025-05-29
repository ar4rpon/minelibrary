<?php

namespace Database\Factories;

use App\Models\ShareLink;
use App\Models\BookShelf;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ShareLink>
 */
class ShareLinkFactory extends Factory
{
    protected $model = ShareLink::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'share_token' => bin2hex(random_bytes(16)),
            'book_shelf_id' => BookShelf::factory(),
            'expiry_date' => now()->addDays(7),
        ];
    }

    /**
     * Create an expired share link
     */
    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'expiry_date' => now()->subDays(1),
        ]);
    }

    /**
     * Create a share link for a specific book shelf
     */
    public function forBookShelf(BookShelf $bookShelf): static
    {
        return $this->state(fn (array $attributes) => [
            'book_shelf_id' => $bookShelf->id,
        ]);
    }
}