<?php

namespace Database\Factories;

use App\Models\BookShelf;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BookShelf>
 */
class BookShelfFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = BookShelf::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'book_shelf_name' => $this->faker->words(3, true) . 'の本棚',
            'description' => $this->faker->realText(100),
            'is_public' => $this->faker->boolean(80), // 80%の確率で公開
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    /**
     * 公開本棚を生成
     *
     * @return static
     */
    public function public(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'is_public' => true,
            ];
        });
    }

    /**
     * 非公開本棚を生成
     *
     * @return static
     */
    public function private(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'is_public' => false,
            ];
        });
    }

    /**
     * 特定のテーマの本棚を生成
     *
     * @param string $theme
     * @return static
     */
    public function withTheme(string $theme): static
    {
        return $this->state(function (array $attributes) use ($theme) {
            return [
                'book_shelf_name' => $theme . 'の本棚',
                'description' => $theme . 'に関する本を集めた本棚です。',
            ];
        });
    }

    /**
     * プログラミング本棚を生成
     *
     * @return static
     */
    public function programming(): static
    {
        return $this->state(function (array $attributes) {
            $languages = ['PHP', 'JavaScript', 'Python', 'Ruby', 'Go'];
            $language = $this->faker->randomElement($languages);
            
            return [
                'book_shelf_name' => $language . '学習本棚',
                'description' => $language . 'の学習に役立つ本を集めています。',
            ];
        });
    }

    /**
     * 読書リスト本棚を生成
     *
     * @return static
     */
    public function readingList(): static
    {
        return $this->state(function (array $attributes) {
            $year = date('Y');
            $month = $this->faker->monthName();
            
            return [
                'book_shelf_name' => "{$year}年{$month}の読書リスト",
                'description' => "今月読みたい本・読んだ本のリストです。",
            ];
        });
    }

    /**
     * 特定のユーザーに属する本棚を生成
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
}