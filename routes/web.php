<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $authors = App\Models\ShaderAuthor::orderBy('name')->get();
    return view('editor', compact('authors'));
});

// Google SSO
Route::get('/auth/google', [App\Http\Controllers\Auth\SocialiteController::class, 'redirectToGoogle'])->name('auth.google');
Route::get('/auth/google/callback', [App\Http\Controllers\Auth\SocialiteController::class, 'handleGoogleCallback']);

// Custom Registration (to assign role)
Route::post('/register', [App\Http\Controllers\Auth\CustomRegisterController::class, 'register'])->name('custom.register');
Route::post('/login', [App\Http\Controllers\Auth\CustomLoginController::class, 'login'])->name('custom.login'); 
Route::get('/changelogs', [App\Http\Controllers\ChangelogController::class, 'index'])->name('changelogs.index');
Route::get('/nodes', [App\Http\Controllers\NodeController::class, 'index'])->name('nodes.index');
Route::post('/nodes/set-functions', [App\Http\Controllers\NodeController::class, 'getSetFunctions'])->name('nodes.setfunctions');
Route::post('/logout', function () {
    Auth::logout();
    request()->session()->invalidate();
    request()->session()->regenerateToken();
    return response()->json(['success' => true, 'redirect' => '/']);
})->name('custom.logout');

Route::middleware('auth')->group(function () {
    Route::post('/profile/update', [App\Http\Controllers\ProfileController::class, 'update'])->name('profile.update');
    
    // Patch Management (Write)
    // Admin Messages / Notifications
    Route::get('/notifications/unread', [App\Http\Controllers\AdminMessageController::class, 'index']);
    Route::post('/notifications/{id}/read', [App\Http\Controllers\AdminMessageController::class, 'markRead']);
    Route::post('/notifications/read-all', [App\Http\Controllers\AdminMessageController::class, 'markAllRead']);

    Route::resource('projects', App\Http\Controllers\ProjectController::class);
    Route::post('/patches', [App\Http\Controllers\PatchController::class, 'store']);
    Route::put('/patches/{id}', [App\Http\Controllers\PatchController::class, 'update']);
    Route::delete('/patches/{id}', [App\Http\Controllers\PatchController::class, 'destroy']);
});

// Patch Management (Read) - Publicly accessible for listing/loading
Route::get('/patches', [App\Http\Controllers\PatchController::class, 'index']);
Route::get('/patches/{id}', [App\Http\Controllers\PatchController::class, 'show']);

