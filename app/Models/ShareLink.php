<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ShareLink extends Model
{
    use HasFactory;
    /**
     * 複数代入可能な属性
     *
     * @var array<string>
     */
    protected $fillable = [
        'share_token',
        'book_shelf_id',
        'expiry_date',
    ];

    /**
     * 属性のキャスト
     *
     * @var array<string, string>
     */
    protected $casts = [
        'expiry_date' => 'date',
        'book_shelf_id' => 'integer',
    ];

    /**
     * リンクが有効かどうかを確認する
     *
     * @return bool
     */
    public function isValid(): bool
    {
        return $this->expiry_date->isFuture();
    }

    /**
     * この共有リンクに関連する本棚を取得
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function bookShelf()
    {
        return $this->belongsTo(BookShelf::class);
    }

    /**
     * ブックリストから未ログインユーザーが閲覧できるURLを生成する
     *
     * @param int $book_shelf_id
     * @return string
     */
    public function generateShareLink(int $book_shelf_id): string
    {
        $uniqueToken = bin2hex(random_bytes(16));
        $expiryDate = now()->addDays(7);

        $shareLink = $this->create([
            'share_token' => $uniqueToken,
            'book_shelf_id' => $book_shelf_id,
            'expiry_date' => $expiryDate,
        ]);

        // 元のインスタンスのプロパティを更新
        $this->share_token = $shareLink->share_token;
        $this->book_shelf_id = $shareLink->book_shelf_id;
        $this->expiry_date = $shareLink->expiry_date;

        return url("/shared-booklist/{$shareLink->share_token}");
    }
}
