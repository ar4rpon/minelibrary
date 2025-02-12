<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\Http;
// use Illuminate\Support\Facades\Log;



use Illuminate\Http\Request;

class BookSearchController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'keyword' => 'nullable|string',
            'page' => 'integer|min:1',
            'genre' => 'string',
            'sort' => 'string',
            'searchMethod' => 'in:title,isbn',
        ]);

        $results = [];
        $totalItems = 0;

        if ($request->filled('keyword')) {
            $response = Http::get('https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404', [
                'applicationId' => config('rakuten.app_id'),
                'title' => $validated['searchMethod'] === 'title' ? $validated['keyword'] : null,
                'page' => $validated['page'] ?? 1,
                'booksGenreId' => $validated['genre'] !== 'all' ? $validated['genre'] : null,
                'sort' => $validated['sort'] ?? 'standard',
                'isbn' => $validated['searchMethod'] === 'isbn' ? $validated['keyword'] : null,
                'hits' => 9,
            ]);

            $data = $response->json();
            $results = $data['Items'] ?? [];
            $totalItems = $data['count'] ?? 0;
        }

        return Inertia::render('SearchBook', [
            'results' => $results,
            'totalItems' => $totalItems,
            'filters' => $validated,
        ]);
    }
}
