<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Enums\ReadStatus;

class FavoriteBook extends Model
{
    use HasFactory;
    /**
     * 複数代入可能な属性
     *
     * @var array<string>
     */
    protected $fillable = [
        'isbn',
        'read_status',
    ];

    /**
     * Enumのデータ型
     *
     * @var array<string>
     */
    protected $casts = [
        'read_status' => ReadStatus::class,
    ];
}
