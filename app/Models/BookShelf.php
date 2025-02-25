<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class BookShelf extends Model
{
    use HasFactory;

    /**
     * 複数代入可能な属性
     *
     * @var array<string>
     */
    protected $fillable = [
        'book_shelf_name',
        'description',
        'user_id',
        'is_public',
    ];

    /**
     * 属性のキャスト
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_public' => 'boolean',
    ];

    /**
     * 本のリストを取得する
     *
     * @return BelongsToMany
     */
    public function books(): BelongsToMany
    {
        return $this->belongsToMany(Book::class, 'book_shelf_book', 'book_shelf_id', 'isbn');
    }

    /**
     * 新しいブックリストを追加する
     *
     * @param array $data
     * @return self
     */
    public static function add(array $data): self
    {
        return self::create($data);
    }

    /**
     * ブックリストの名前を更新する
     *
     * @param string $name
     * @return bool
     */
    public function updateName(string $name): bool
    {
        return $this->update(['book_shelf_name' => $name]);
    }

    /**
     * ブックリストの公開状態を更新する
     *
     * @param bool $isPublic
     * @return bool
     */
    public function updateIsPublic(bool $isPublic): bool
    {
        return $this->update(['is_public' => $isPublic]);
    }

    /**
     * ブックリストの説明を更新する
     *
     * @param string $text
     * @return bool
     */
    public function updateDescription(string $text): bool
    {
        return $this->update(['description' => $text]);
    }

    /**
     * 指定されたユーザーIDの全てのブックリストを取得する
     *
     * @param int $userId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getAllByUserId(int $userId): \Illuminate\Database\Eloquent\Collection
    {
        return self::where('create_by_id', $userId)->get();
    }

    /**
     * 本を追加する
     *
     * @param string $isbn
     * @return void
     */
    public function addBook(string $isbn): void
    {
        $this->books()->attach($isbn, ['created_at' => now()]);
    }

    /**
     * 本を削除する
     *
     * @param string $isbn
     * @return void
     */
    public function removeBook(string $isbn): void
    {
        $this->books()->detach($isbn);
    }
}
