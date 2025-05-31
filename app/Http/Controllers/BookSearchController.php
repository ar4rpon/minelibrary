<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Services\BookSearchService;
use App\Http\Requests\BookSearchRequest;

class BookSearchController extends Controller
{
    private BookSearchService $bookSearchService;

    public function __construct(BookSearchService $bookSearchService)
    {
        $this->bookSearchService = $bookSearchService;
    }
    public function index(BookSearchRequest $request)
    {
        $validated = $request->validated();
        $searchResult = $this->bookSearchService->searchBooks($validated);

        return Inertia::render('Book/SearchBook', [
            'results' => $searchResult['results'],
            'totalItems' => $searchResult['totalItems'],
            'filters' => $validated,
        ]);
    }
}
