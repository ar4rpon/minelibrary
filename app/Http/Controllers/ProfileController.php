<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\BookShelf;
use App\Models\FavoriteBook;
use App\Models\Memo;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * 共通のプロフィールデータを取得するメソッド
     */
    private function getProfileData(User $user)
    {
        // ユーザーの直近5件のメモを取得
        $recentMemos = Memo::where('user_id', $user->id)
            ->with('book')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($memo) {
                return [
                    'id' => $memo->id,
                    'memo' => $memo->memo,
                    'memo_chapter' => $memo->memo_chapter,
                    'memo_page' => $memo->memo_page,
                    'created_at' => $memo->created_at->format('Y-m-d'),
                    'book' => [
                        'isbn' => $memo->book->isbn,
                        'title' => $memo->book->title,
                        'author' => $memo->book->author,
                        'image_url' => $memo->book->image_url,
                    ],
                ];
            });

        // ユーザーの直近5件のお気に入り書籍を取得
        $recentFavorites = FavoriteBook::where('user_id', $user->id)
            ->with('book')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($favorite) {
                return [
                    'isbn' => $favorite->isbn,
                    'read_status' => $favorite->read_status,
                    'created_at' => $favorite->created_at->format('Y-m-d'),
                    'book' => [
                        'title' => $favorite->book->title,
                        'author' => $favorite->book->author,
                        'image_url' => $favorite->book->image_url,
                    ],
                ];
            });

        // ユーザーの公開本棚を取得
        $bookShelves = BookShelf::where('user_id', $user->id)
            ->where('is_public', true)
            ->select(
                'id',
                'book_shelf_name',
                'description',
                'is_public',
                'created_at'
            )
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($bookShelf) {
                // 本棚に含まれる本の数を取得
                $bookCount = $bookShelf->books()->count();

                return [
                    'id' => $bookShelf->id,
                    'name' => $bookShelf->book_shelf_name,
                    'description' => $bookShelf->description,
                    'is_public' => $bookShelf->is_public,
                    'created_at' => $bookShelf->created_at->format('Y-m-d'),
                    'book_count' => $bookCount,
                ];
            });

        return [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'profile_image' => $user->profile_image,
                'profile_message' => $user->profile_message,
            ],
            'recentMemos' => $recentMemos,
            'recentFavorites' => $recentFavorites,
            'bookShelves' => $bookShelves,
        ];
    }

    /**
     * 自分自身のプロフィールページを表示
     */
    public function show(Request $request): Response
    {
        $user = $request->user();
        $data = $this->getProfileData($user);

        // 自分のプロフィールの場合は、非公開の本棚も表示
        $privateBookShelves = BookShelf::where('user_id', $user->id)
            ->where('is_public', false)
            ->select(
                'id',
                'book_shelf_name',
                'description',
                'is_public',
                'created_at'
            )
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($bookShelf) {
                $bookCount = $bookShelf->books()->count();
                return [
                    'id' => $bookShelf->id,
                    'name' => $bookShelf->book_shelf_name,
                    'description' => $bookShelf->description,
                    'is_public' => $bookShelf->is_public,
                    'created_at' => $bookShelf->created_at->format('Y-m-d'),
                    'book_count' => $bookCount,
                ];
            });

        // 公開と非公開の本棚を結合
        $data['bookShelves'] = $data['bookShelves']->concat($privateBookShelves)->sortByDesc('created_at')->values();
        $data['isOwnProfile'] = true;

        return Inertia::render('features/profile/pages/Show', $data);
    }

    /**
     * 他のユーザーのプロフィールページを表示
     */
    public function showUser($userId): Response
    {
        $user = User::findOrFail($userId);
        $data = $this->getProfileData($user);
        $data['isOwnProfile'] = Auth::id() === $user->id;

        return Inertia::render('features/profile/pages/Show', $data);
    }

    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('features/profile/pages/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
