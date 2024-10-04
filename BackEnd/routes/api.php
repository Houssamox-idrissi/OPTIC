<?php

use App\Http\Controllers\API\AdminController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\TypeVerreController;
use App\Http\Controllers\API\ClientController;
use App\Http\Controllers\API\FournisseurController as APIFournisseurController;
use App\Http\Controllers\API\OueilController;
use App\Http\Controllers\Api\StatsController;
use App\Http\Controllers\ClientCommandGlassesController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('admin/register', [AdminController::class, 'register']);
Route::post('admin/login', [AdminController::class, 'login']);
Route::post('admin/logout', [AdminController::class, 'logout']);
Route::get('admin/user', [AdminController::class, 'user']);

Route::middleware(['auth:api'])->group(function () {
    Route::get('/admin', [AdminController::class, 'showAuthenticatedAdmin']);
    Route::post('/store-client-command-glasses', [ClientCommandGlassesController::class, 'store']);
    Route::get('/client-command-glasses/{id}', [ClientCommandGlassesController::class, 'show']);
    Route::get('/client-command-glasses', [ClientCommandGlassesController::class, 'index']);
    Route::put('/commands/{id}', [ClientCommandGlassesController::class, 'update']);
    Route::post('/check-client', [ClientCommandGlassesController::class, 'checkClient']);
    Route::apiResource('clients', ClientController::class);
    Route::apiResource('fournisseurs', APIFournisseurController::class);
    Route::apiResource('type-verres', TypeVerreController::class);
    Route::delete('/client-command-glasses/{id}', [ClientCommandGlassesController::class, 'destroy']); // Fix method for delete
    Route::post('/commands/{id}/status', [ClientCommandGlassesController::class, 'updateStatus']);
    Route::get('/earnings', [StatsController::class, 'getEarnings']);
});


