<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Services\ProfileService;
use App\Models\User;
use App\Http\Traits\HandlesUserAuth;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    use HandlesUserAuth;
    
    private ProfileService $profileService;

    public function __construct(ProfileService $profileService)
    {
        $this->profileService = $profileService;
    }

    /**
     * 自分自身のプロフィールページを表示
     */
    public function show(Request $request): Response
    {
        $user = $this->getAuthUser();
        $currentUserId = $this->getAuthUserId();
        $data = $this->profileService->getProfileData($user, $currentUserId);

        // 自分のプロフィールの場合は、非公開の本棚も表示
        $privateBookShelves = $this->profileService->getPrivateBookShelves($user);

        // 公開と非公開の本棚を結合
        $data['bookShelves'] = $data['bookShelves']->concat($privateBookShelves)->sortByDesc('created_at')->values();
        $data['isOwnProfile'] = true;

        return Inertia::render('Profile/Show', $data);
    }

    /**
     * 他のユーザーのプロフィールページを表示
     */
    public function showUser($userId): Response
    {
        $user = User::findOrFail($userId);
        $currentUserId = $this->getAuthUserId();
        $data = $this->profileService->getProfileData($user, $currentUserId);
        $data['isOwnProfile'] = $currentUserId === $user->id;

        return Inertia::render('Profile/Show', $data);
    }

    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $this->getAuthUser() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $this->profileService->updateProfile($this->getAuthUser(), $request->validated());

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

        $user = $this->getAuthUser();
        
        $this->profileService->deleteAccount($user);

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
