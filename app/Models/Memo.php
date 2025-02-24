<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Memo extends Model
{
    use HasFactory;

    /**
     * 複数代入可能な属性
     *
     * @var array<string, mixed>
     */
    protected $fillable = [
        'isbn',
        'memo',
        'memo_chapter',
        'memo_page',
        'user_id',
    ];

    /**
     * 属性のキャスト
     *
     * @var array<string, string>
     */
    protected $casts = [
        'memo_page' => 'integer',
        'memo_chapter' => 'integer',
        'isbn' => 'string',
    ];

    /**
     * メモを書いた本の詳細データを取得する
     *
     * @return BelongsTo
     */
    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class, 'isbn', 'isbn');
    }

    /**
     * メモを作成したユーザーのデータを取得する
     *
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * メモを作成する
     *
     * @param string $isbn
     * @param string $memo
     * @param int $userId
     * @param string|null $memoChapter
     * @param int|null $memoPage
     * @return self
     */
    public static function createMemo(string $isbn, string $memo, int $userId, ?string $memoChapter = null, ?int $memoPage = null): self
    {
        return self::create([
            'isbn' => $isbn,
            'memo' => $memo,
            'user_id' => $userId,
            'memo_chapter' => $memoChapter,
            'memo_page' => $memoPage,
        ]);
    }

    /**
     * メモを更新する
     *
     * @param string $memo
     * @param int|null $memoChapter
     * @param int|null $memoPage
     * @return bool
     */
    public function updateMemo(string $memo, ?int $memoChapter = null, ?int $memoPage = null): bool
    {
        return $this->update([
            'memo' => $memo,
            'memo_chapter' => $memoChapter,
            'memo_page' => $memoPage,
        ]);
    }
}
