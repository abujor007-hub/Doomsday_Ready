
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MovieController;
use App\Http\Controllers\Api\CinemaController;

// Movie API Routes
Route::prefix('movies')->group(function () {
    Route::get('/', [MovieController::class, 'index']);
    Route::post('/', [MovieController::class, 'store']);

    Route::patch('/{id}', [MovieController::class, 'update'])
        ->whereNumber('id');

    Route::get('/{id}/rewatch-order', [MovieController::class, 'rewatchOrder'])
        ->whereNumber('id');
});

// Cinema API Routes
Route::prefix('cinemas')->group(function () {

    Route::get('/', [CinemaController::class, 'index']);

    Route::post('/', [CinemaController::class, 'store']);

    Route::post('/{id}/calculate', [CinemaController::class, 'calculate'])
        ->whereNumber('id');

    Route::get('/{id}/booking', [CinemaController::class, 'booking'])
        ->whereNumber('id');

});
