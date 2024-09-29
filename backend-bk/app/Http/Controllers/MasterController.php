<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class MasterController extends Controller
{
    /**
     * Fetch records from any specified table with optional filters and sorting.
     *
     * @param Request $request
     * @param string
     * @return
     */
    public function getTableData(Request $request, $table)
    {
        if (!\Schema::hasTable($table)) {
            return response()->json(['error' => 'Table does not exist.'], 404);
        }

        try {
            $query = DB::table($table);

            if ($request->has('filters')) {
                $filters = $request->input('filters');

                foreach ($filters as $column => $value) {
                    if (\Schema::hasColumn($table, $column)) {
                        $query->where($column, $value);
                    }
                }
            }

            if ($request->has('sort_by') && $request->has('sort_order')) {
                $sortBy = $request->input('sort_by');
                $sortOrder = $request->input('sort_order', 'asc');

                if (\Schema::hasColumn($table, $sortBy)) {
                    $query->orderBy($sortBy, $sortOrder);
                }
            }

            $data = $query->get();

            return response()->json($data);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Error fetching data: ' . $e->getMessage()], 500);
        }
    }
}
