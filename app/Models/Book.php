<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Book extends Model
{
    use HasFactory;
    /**
     * モデルのIDを自動増分するか
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * テーブルに関連付ける主キー
     *
     * @var string
     */
    protected $primaryKey = 'isbn';

    /**
     * 主キーIDのデータ型
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * 複数代入可能な属性
     *
     * @var array<string>
     */
    protected $fillable = [
        'isbn',
        'author',
        'publisher_name',
        'sales_date',
        'title',
        'image_url',
    ];


    /**
     * 本を追加するメソッド
     *
     * @param array $data
     * @return Book
     */
    public function addBook(array $data): Book
    {
        return self::create($data);
    }

    /**
     * ISBNで本の情報を取得するメソッド
     *
     * @param string $isbn
     * @return Book|null
     */
    public function getBookInfo(string $isbn): ?Book
    {
        return self::find($isbn);
    }
}
