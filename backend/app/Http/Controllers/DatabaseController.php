<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema; // Import the Schema facade

class DatabaseController extends Controller
{
    public function index()
    {
        // Get all the table names in the database
        $tables = DB::select('SHOW TABLES');
        
        $databaseStructure = [];

        foreach ($tables as $table) {
            $tableName = array_values((array) $table)[0]; // Extract table name from object
            // Get the columns for each table
            $columns = Schema::getColumnListing($tableName); // Use Schema facade to get columns
            // Store the table and its columns
            $databaseStructure[$tableName] = $columns;
        }

        // Return the structure as a JSON response
        return response()->json($databaseStructure);
    }

    public function getAllData()
    {
        // Define the tables to be excluded
        $excludedTables = ['users', 'roles'];

        // Get all the tables from the database
        $tables = DB::select('SHOW TABLES');

        // Structure will depend on your database; assuming MySQL
        $tableKey = 'Tables_in_' . env('DB_DATABASE');
        $allData = [];

        // Loop through each table
        foreach ($tables as $table) {
            $tableName = $table->$tableKey;

            // Skip excluded tables
            if (in_array($tableName, $excludedTables)) {
                continue;
            }

            // Get all data from the current table
            $data = DB::table($tableName)->get();

            // Add the data to the result array
            $allData[$tableName] = $data;
        }

        // Return the combined data as a JSON response
        return response()->json($allData);
    }
}
