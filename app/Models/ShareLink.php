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
        'share_link_url',
        'book_list_id',
    ];

    /**
     * 属性のキャスト
     *
     * @var array<string, string>
     */
    protected $casts = [
        'expiry_date' => 'date',
        'book_list_id' => 'integer',
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
     * ブックリストから未ログインユーザーが閲覧できるURLを生成する
     *
     * @param int $book_list_id
     * @return string
     */
    public function generateShareLink(int $book_list_id): string
    {
        $uniqueToken = bin2hex(random_bytes(16));
        $expiryDate = now()->addDays(7);

        $shareLink = $this->create([
            'share_token' => $uniqueToken,
            'book_list_id' => $book_list_id,
            'expiry_date' => $expiryDate,
        ]);

        return url("/shared-booklist/{$shareLink->share_token}");
    }
}
