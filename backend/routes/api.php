<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DatabaseController;

//User Routes
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('/register', [AuthController::class, 'register']);


Route::middleware('auth:sanctum')->group(function () {
    //Order Routes
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::put('/orders/{id}', [OrderController::class, 'update']);
    
    //Database Routes
    
});

Route::get('/db-index', [DatabaseController::class, 'index']);
Route::get('/all-data', [DatabaseController::class, 'getAllData']);

