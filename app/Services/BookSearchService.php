<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class BookSearchService
{
    /**
     * 楽天Books APIで本を検索
     *
     * @param array $searchParams
     * @return array
     */
    public function searchBooks(array $searchParams): array
    {
        if (empty($searchParams['keyword'])) {
            return [
                'results' => [],
                'totalItems' => 0,
            ];
        }

        $response = Http::get('https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404', [
            'applicationId' => config('rakuten.app_id'),
            'title' => isset($searchParams['searchMethod']) && $searchParams['searchMethod'] === 'title' ? $searchParams['keyword'] : null,
            'page' => $searchParams['page'] ?? 1,
            'booksGenreId' => ($searchParams['genre'] ?? 'all') !== 'all' ? $searchParams['genre'] : null,
            'sort' => $searchParams['sort'] ?? 'standard',
            'isbn' => isset($searchParams['searchMethod']) && $searchParams['searchMethod'] === 'isbn' ? $searchParams['keyword'] : null,
            'hits' => 9,
        ]);

        $data = $response->json();
        $results = $this->formatSearchResults($data['Items'] ?? []);
        
        return [
            'results' => $results,
            'totalItems' => $data['count'] ?? 0,
        ];
    }

    /**
     * 検索結果をフォーマット
     *
     * @param array $items
     * @return array
     */
    private function formatSearchResults(array $items): array
    {
        return array_map(function ($item) {
            if (isset($item['Item']['largeImageUrl'])) {
                $item['Item']['largeImageUrl'] = str_replace(
                    'ex=200x200',
                    'ex=300x300',
                    $item['Item']['largeImageUrl']
                );
            }
            
            // 変数名を統一するためにキーを追加
            $item['Item']['publisher_name'] = $item['Item']['publisherName'];
            $item['Item']['item_caption'] = $item['Item']['itemCaption'];
            $item['Item']['sales_date'] = $item['Item']['salesDate'];
            $item['Item']['item_price'] = $item['Item']['itemPrice'];
            $item['Item']['image_url'] = $item['Item']['largeImageUrl'];

            return $item;
        }, $items);
    }
}