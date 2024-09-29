<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\CrmController;
use App\Http\Controllers\ProductionController;
use App\Http\Controllers\TasksController;
use App\Http\Controllers\FormController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\SchemaController;
use App\Http\Controllers\MasterController;
use App\Http\Controllers\TableBuilderController;

/*
|--------------------------------------------------------------------------
| Basic Routes
|--------------------------------------------------------------------------
*/

Route::post('/assign-permissions', [AuthController::class, 'assignPermissions']);

Route::get('/test-connection', function () {
    return response()->json(['message' => 'API connection successful'], 200);
});

Route::get('/test-db-connection', function () {
    try {
        DB::connection()->getPdo();
        return response()->json(['message' => 'Database connection successful'], 200);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Database connection failed', 'error' => $e->getMessage()], 500);
    }
});

Route::get('/test-db-connection-redux', function () {
    try {
        DB::connection('mysql_erp')->getPdo();
        return response()->json(['message' => 'Database connection to redux successful'], 200);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Database connection to redux failed', 'error' => $e->getMessage()], 500);
    }
});

/*
|--------------------------------------------------------------------------
| User Routes
|--------------------------------------------------------------------------
*/

// User registration and authentication
Route::post('/users', [UserController::class, 'store']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

// User details without authentication middleware
Route::get('/user/roles-permissions', [AuthController::class, 'getRolesAndPermissions']);
Route::get('/user/details', [AuthController::class, 'getUserDetails']);
Route::post('/update-passwords', [AuthController::class, 'updatePasswords']);
Route::get('/user', [AuthController::class, 'user']);

/*
|--------------------------------------------------------------------------
| Inventory Routes
|--------------------------------------------------------------------------
*/

Route::get('/inventory/options', [InventoryController::class, 'getOptionsWithChildren']);
Route::get('/inventory/all', [InventoryController::class, 'index']);
Route::get('/locations/all', [InventoryController::class, 'getInventoryLocations']);
Route::post('/locations/create', [InventoryController::class, 'createInventoryLocation']);
Route::get('/suppliers/all', [InventoryController::class, 'getAllSuppliers']);
Route::post('/suppliers/create', [InventoryController::class, 'createSupplier']);

Route::post('/inventory/bulk-upload', [InventoryController::class, 'bulkUpload']);
Route::post('/assignlocations', [InventoryController::class, 'randomizeHardwareLocation']);

/*
|--------------------------------------------------------------------------
| Production Routes
|--------------------------------------------------------------------------
*/

Route::get('/equipment', [ProductionController::class, 'getEquipment']);
Route::get('/production/users', [ProductionController::class, 'getProductionUsers']);
Route::get('/production/unassigned-orders', [ProductionController::class, 'getUnassignedOrders']);
Route::post('/production/schedule-order', [ProductionController::class, 'scheduleOrder']);
Route::post('/production/update-times', [ProductionController::class, 'updateTimes']);

/*
|--------------------------------------------------------------------------
| CRM Routes
|--------------------------------------------------------------------------
*/

Route::post('/customers', [CrmController::class, 'store']);
Route::get('/customers/all', [CrmController::class, 'index']);
Route::post('/orders', [CrmController::class, 'storeOrder']);
Route::get('/orders', [CrmController::class, 'indexOrders']);

Route::post('/suppliers/bulk-upload', [CrmController::class, 'bulkUpload']);
Route::post('/customers/bulk-upload', [CrmController::class, 'bulkUploadCustomers']);
Route::post('/addresses/bulk-upload', [CrmController::class, 'bulkUploadAddresses']);

/*
|--------------------------------------------------------------------------
| Task Routes
|--------------------------------------------------------------------------
*/

Route::get('/tasks', [TasksController::class, 'index']); // Get all tasks
Route::get('/tasks/{userId}', [TasksController::class, 'userTasks']); // Get tasks for a specific user
Route::post('/tasks', [TasksController::class, 'store']); // Create a new task
Route::put('/tasks/{id}', [TasksController::class, 'update']); // Update a task

/*
|--------------------------------------------------------------------------
| Form Routes
|--------------------------------------------------------------------------
*/

Route::get('/forms', [FormController::class, 'index']);
Route::get('/forms/{id}', [FormController::class, 'show']);
Route::post('/forms', [FormController::class, 'store']);
Route::put('/forms/{id}', [FormController::class, 'update']);
Route::post('/fields', [FormController::class, 'saveField']);
Route::get('/fields', [FormController::class, 'getFields']);
Route::get('/fields/{id}', [FormController::class, 'getField']);
Route::get('/completed-forms', [FormController::class, 'completedIndex']);
Route::post('/completed-forms', [FormController::class, 'completedStore']);
Route::get('/completed-forms/{id}', [FormController::class, 'completedShow']);
Route::put('/completed-forms/{id}', [FormController::class, 'completedUpdate']);
Route::delete('/completed-forms/{id}', [FormController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

Route::get('/settings', [AdminController::class, 'index']);
Route::post('/settings', [AdminController::class, 'store']);
Route::get('/settings/{id}', [AdminController::class, 'show']);
Route::put('/settings/{id}', [AdminController::class, 'update']);
Route::delete('/settings/{id}', [AdminController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| Workflow and Schema Routes
|--------------------------------------------------------------------------
*/

Route::get('/schema/tables', [SchemaController::class, 'getTables']);
Route::get('/data/{table}', [MasterController::class, 'getTableData']);
Route::post('/build-tables', [TableBuilderController::class, 'buildTables']);

Route::get('/inventory', [InventoryController::class, 'showAllModels']);
