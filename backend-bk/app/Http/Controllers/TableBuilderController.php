<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

class TableBuilderController extends Controller
{
    /**
     * Build tables from configuration.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function buildTables(Request $request)
    {
        $config = $request->input('config');

        // Step 1: Create tables without foreign keys
        foreach ($config['tables'] as $table) {
            Schema::create($table['name'], function (Blueprint $tableBlueprint) use ($table) {
                // Automatically add an 'id' column as an unsignedBigInteger primary key
                $tableBlueprint->id();  // Creates an auto-incrementing 'id' as unsignedBigInteger

                // Add other columns as specified in the configuration
                foreach ($table['columns'] as $column) {
                    $this->addColumn($tableBlueprint, $column);
                }

                // Set charset and collation
                $tableBlueprint->charset = 'utf8mb4';
                $tableBlueprint->collation = 'utf8mb4_unicode_ci';

                // Specify the storage engine
                $tableBlueprint->engine = 'InnoDB';
            });
        }

        // Step 2: Explicitly add indexes for foreign key columns
        foreach ($config['tables'] as $table) {
            if (!empty($table['foreign_keys'])) {
                Schema::table($table['name'], function (Blueprint $tableBlueprint) use ($table) {
                    foreach ($table['foreign_keys'] as $fk) {
                        // Add an index for the foreign key column first
                        $tableBlueprint->index($fk['column'], $fk['column'] . '_idx');
                    }
                });
            }
        }

        // Step 3: Add foreign keys
        foreach ($config['tables'] as $table) {
            if (!empty($table['foreign_keys'])) {
                Schema::table($table['name'], function (Blueprint $tableBlueprint) use ($table) {
                    foreach ($table['foreign_keys'] as $fk) {
                        $tableBlueprint->foreign($fk['column'])
                            ->references($fk['references'])
                            ->on($fk['on'])
                            ->onDelete('cascade')  // Adjust this as needed
                            ->onUpdate('cascade'); // Adjust this as needed
                    }
                });
            }
        }

        return response()->json(['status' => 'success'], 200);
    }

    /**
     * Add column to the table blueprint.
     *
     * @param Blueprint $tableBlueprint
     * @param array $column
     * @return void
     */
    private function addColumn(Blueprint $tableBlueprint, $column)
    {
        $type = $column['type'];
        $name = $column['name'];
        $nullable = isset($column['nullable']) ? $column['nullable'] : false;

        $columnObject = null;

        switch ($type) {
            case 'unsignedBigInteger':
                $columnObject = $tableBlueprint->unsignedBigInteger($name);
                break;
            case 'string':
                $columnObject = $tableBlueprint->string($name);
                break;
            case 'timestamp':
                $columnObject = $tableBlueprint->timestamp($name);
                break;
            // Add other column types as needed
            default:
                throw new \Exception("Unsupported column type: $type");
        }

        if ($nullable) {
            $columnObject->nullable();
        }
    }
}
