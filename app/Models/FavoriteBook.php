<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Enums\ReadStatus;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Collection;


class FavoriteBook extends Model
{
    use HasFactory;

    /**
     * 複数代入可能な属性
     *
     * @var array<mixed>
     */
    protected $fillable = [
        'isbn',
        'read_status',
        'user_id',
    ];

    /**
     * 属性のキャスト
     *
     * @var array<string, string>
     */
    protected $casts = [
        'read_status' => ReadStatus::class,
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
     * お気に入り本の詳細データを取得する
     *
     * @return BelongsTo
     */
    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class, 'isbn', 'isbn');
    }

    /**
     * お気に入りの本を追加する
     *
     * @param string $isbn
     * @param int $userId
     * @return self
     */
    public static function addFavorite(string $isbn, int $userId): self
    {
        return self::create([
            'isbn' => $isbn,
            'user_id' => $userId,
            'read_status' => ReadStatus::WANTREAD,
        ]);
    }

    /**
     * 読書ステータスを更新する
     *
     * @param ReadStatus $status
     * @return bool
     */
    public function updateReadStatus(ReadStatus $status): bool
    {
        return $this->update(['read_status' => $status]);
    }

    /**
     * 指定されたユーザーIDのお気に入りの本を取得する
     *
     * @param int $userId
     * @return Collection
     */
    public static function getFavoritesByUserId(int $userId): Collection
    {
        return self::where('user_id', $userId)->get();
    }
}
