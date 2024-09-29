<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\InventoryItem;
use League\Csv\Reader;
use League\Csv\Statement;

class ImportInventory extends Command
{
    protected $signature = 'inventory:import {file}';
    protected $description = 'Import inventory from a CSV file';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $file = $this->argument('file');

        if (!file_exists($file) || !is_readable($file)) {
            $this->error('CSV file not found or not readable');
            return;
        }

        try {
            $csv = Reader::createFromPath($file, 'r');
            $csv->setHeaderOffset(0); // Set the CSV header offset

            $stmt = (new Statement())->offset(0);
            $records = $stmt->process($csv);

            foreach ($records as $record) {
                InventoryItem::updateOrCreate(
                    ['sku' => $record['sku']], // Adjust column names as necessary
                    [
                        'name' => $record['name'],
                        'category' => $record['category'],
                        'type' => $record['type'],
                        'subcat' => $record['subcat'],
                        'active' => $record['active'],
                    ]
                );
            }

            $this->info('Inventory imported successfully');
        } catch (\Exception $e) {
            $this->error('Error processing the CSV file: ' . $e->getMessage());
        }
    }
}
