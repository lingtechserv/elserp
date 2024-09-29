<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class DatabaseIndexer
{
    public function getTables()
    {
        // Get all table names
        $tables = DB::select('SHOW TABLES');
        $tableKey = 'Tables_in_' . env('DB_DATABASE');
        $result = [];

        foreach ($tables as $table) {
            $tableName = $table->$tableKey;
            $result[$tableName] = $this->getTableDetails($tableName);
        }

        return $result;
    }

    private function getTableDetails($tableName)
    {
        // Get table column details
        $columns = DB::select("SHOW COLUMNS FROM $tableName");

        $details = [];
        foreach ($columns as $column) {
            $details[] = [
                'Field' => $column->Field,
                'Type' => $column->Type,
                'Null' => $column->Null,
                'Key' => $column->Key,
                'Default' => $column->Default,
                'Extra' => $column->Extra
            ];
        }

        return $details;
    }
}
