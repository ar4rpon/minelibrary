<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Collection;

class FavoriteBookShelf extends Model
{
    use HasFactory;

    /**
     * 複数代入可能な属性
     *
     * @var array<mixed>
     */
    protected $fillable = [
        'book_shelf_id',
        'user_id',
    ];

    /**
     * お気に入り追加しているユーザーのデータを取得する
     *
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * お気に入りブックリストの詳細データを取得する
     *
     * @return BelongsTo
     */
    public function bookshelf(): BelongsTo
    {
        return $this->belongsTo(BookShelf::class, 'book_shelf_id');
    }

    /**
     * お気に入りのブックリストを追加する
     *
     * @param int $BookShelfId
     * @param int $userId
     * @return self
     */
    public static function addFavorite(int $BookShelfId, int $userId): self
    {
        return self::create([
            'book_shelf_id' => $BookShelfId,
            'user_id' => $userId,
        ]);
    }

    /**
     * 指定されたユーザーIDのお気に入りのブックリストを取得する
     *
     * @param int $userId
     * @return Collection
     */
    public static function getFavoritesByUserId(int $userId): Collection
    {
        return self::where('user_id', $userId)->get();
    }
}
