<?php

namespace App\Http\Controllers;

use App\Models\BookShelf;
use Illuminate\Support\Facades\Auth;

use Illuminate\Http\Request;

class BookShelfController extends Controller
{
    public function store(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'book_shelf_name' => 'required|string',
            'description' => 'required|string',
        ]);
        $bookShelf = (new BookShelf())->add(
            [
                'user_id' => $user->id,
                'book_shelf_name' => $request->book_shelf_name,
                'description' => $request->description,
                'is_public' => true
            ]
        );
        return $bookShelf;
    }
}
