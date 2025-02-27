<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * 複数代入可能な属性
     *
     * @var list<string>
     */
    protected $fillable = [
        'email',
        'password',
        'name',
        'profile_image',
        'profile_message',
        'is_memo_publish',
    ];

    /**
     * シリアライズ時に隠すべき属性
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * キャストすべき属性
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * ユーザーのお気に入りの本を取得
     *
     * @return HasMany
     */
    public function favoriteBooks(): HasMany
    {
        return $this->hasMany(FavoriteBook::class);
    }

    /**
     * ユーザーのお気に入りの本リストを取得
     *
     * @return HasMany
     */
    public function favoriteBookLists(): HasMany
    {
        return $this->hasMany(FavoriteBookShelf::class);
    }

    /**
     * The books that the user has favorited.
     */
    public function favorites()
    {
        return $this->belongsToMany(Book::class, 'favorites', 'user_id', 'book_id');
    }
}
