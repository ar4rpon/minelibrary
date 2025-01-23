<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;

class RakutenBooksController extends Controller
{
    public function basic_request()
    {
        $client = new Client();
        $response = $client->request(
            'GET',
            'https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404',
            [
                'query' => [
                    'applicationId' => env('RAKUTEN_APP_ID'),
                    // 'isbn' => '4297127830',
                    'title' => 'React',
                    'elements' => 'title,author,booksGenreId,isbn,itemPrice,publisherName,publisherName,largeImageUrl,itemUrl,pageCount,page,last,hits,first,count,carrier',
                    'format' => 'json'
                ]
            ]
        );

        return json_decode($response->getBody(), true);
    }
}
