<?php

namespace App\Http\Traits;

trait HandlesEagerLoading
{
    /**
     * お気に入り本の状態を効率的に取得する
     *
     * @param \Illuminate\Database\Eloquent\Collection $books
     * @param int $userId
     * @return \Illuminate\Support\Collection
     */
    protected function loadFavoriteStatuses($books, int $userId)
    {
        $favoriteModel = app('App\Models\FavoriteBook');
        
        return $favoriteModel::where('user_id', $userId)
            ->whereIn('isbn', $books->pluck('isbn'))
            ->pluck('read_status', 'isbn');
    }
    
    /**
     * 本のデータをフォーマットする（お気に入り状態付き）
     *
     * @param \Illuminate\Database\Eloquent\Collection $books
     * @param \Illuminate\Support\Collection $favoriteStatuses
     * @return \Illuminate\Support\Collection
     */
    protected function formatBooksWithFavoriteStatus($books, $favoriteStatuses)
    {
        return $books->map(function ($book) use ($favoriteStatuses) {
            return [
                'isbn' => $book->isbn,
                'read_status' => $favoriteStatuses->get($book->isbn),
                'book' => [
                    'title' => $book->title,
                    'author' => $book->author,
                    'publisher_name' => $book->publisher_name,
                    'sales_date' => $book->sales_date,
                    'image_url' => $book->image_url,
                    'item_caption' => $book->item_caption,
                    'item_price' => $book->item_price,
                ],
            ];
        });
    }
    
    /**
     * 効率的なクエリビルダーを使用してデータを取得
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param array $with
     * @param array $select
     * @return \Illuminate\Database\Eloquent\Builder
     */
    protected function optimizeQuery($query, array $with = [], array $select = [])
    {
        if (!empty($select)) {
            $query = $query->select($select);
        }
        
        if (!empty($with)) {
            $query = $query->with($with);
        }
        
        return $query;
    }
}