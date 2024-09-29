<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class SchemaController extends Controller
{
    public function getTables(Request $request)
    {
        $tables = DB::select('SHOW TABLES');

        $tableNames = array_map('current', $tables);

        $tablesToOmit = [
            "oauth_personal_access_clients",
            "oauth_refresh_tokens",
            "oauth_access_tokens",
            "oauth_auth_codes",
            "oauth_clients"
        ];

        $filteredTableNames = array_filter($tableNames, function($tableName) use ($tablesToOmit) {
            return !in_array($tableName, $tablesToOmit);
        });

        $schema = [];
        foreach ($filteredTableNames as $tableName) {
            $columns = DB::select("SHOW COLUMNS FROM $tableName");
            $schema[$tableName] = $columns;
        }

        return response()->json($schema);
    }
}
