<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Memo extends Model
{
    use HasFactory;
    /**
     * 複数代入可能な属性
     *
     * @var array<string>
     */
    protected $fillable = [
        'isbn',
        'memo',
        'memo_chapter',
        'memo_page',
    ];

    /**
     * メモを作成する
     *
     * @param string $isbn
     * @param string $memo
     * @param string|null $memoChapter
     * @param int|null $memoPage
     * @return self
     */
    public static function createMemo(string $isbn, string $memo, ?string $memoChapter = null, ?int $memoPage = null): self
    {
        return self::create([
            'isbn' => $isbn,
            'memo' => $memo,
            'memo_chapter' => $memoChapter,
            'memo_page' => $memoPage,
        ]);
    }

    /**
     * メモを更新する
     *
     * @param int $id
     * @param string $memo
     * @param string|null $memoChapter
     * @param int|null $memoPage
     * @return bool
     */
    public static function updateMemo(int $id, string $memo, ?string $memoChapter = null, ?int $memoPage = null): bool
    {
        $memoRecord = self::find($id);
        if ($memoRecord) {
            return $memoRecord->update([
                'memo' => $memo,
                'memo_chapter' => $memoChapter,
                'memo_page' => $memoPage,
            ]);
        }
        return false;
    }
}
