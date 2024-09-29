<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\InventoryItem;
use App\Models\Detail;
use App\Models\InventoryDetail;

class SyncInventoryDetails extends Command
{
    protected $signature = 'sync:inventory-details';
    protected $description = 'Sync inventory items with details based on type, category, and subcat';

    public function handle()
    {
        $inventoryItems = InventoryItem::all();

        if ($inventoryItems->isEmpty()) {
            \Log::info('No inventory items found.');
        }

        // Initialize a counter to track the number of affected rows.
        $affectedRowsCount = 0;

        foreach ($inventoryItems as $inventoryItem) {
            $matchingDetails = Detail::where('type', $inventoryItem->type)
                ->where('category', $inventoryItem->category)
                ->where('subcat', $inventoryItem->subcat)
                ->get();

            if ($matchingDetails->isEmpty()) {
                \Log::info("No matching details found for inventory item ID {$inventoryItem->id}.");
            }

            foreach ($matchingDetails as $detail) {
                $existingEntry = InventoryDetail::where('inventory_id', $inventoryItem->id)
                    ->where('details_id', $detail->id)
                    ->first();

                if (!$existingEntry) {
                    InventoryDetail::create([
                        'inventory_id' => $inventoryItem->id,
                        'details_id' => $detail->id,
                    ]);
                    \Log::info("Created InventoryDetail for InventoryItem ID {$inventoryItem->id} and Detail ID {$detail->id}.");
                    // Increment the counter for each affected row.
                    $affectedRowsCount++;
                }
            }
        }

        // Log the total number of affected rows after processing is complete.
        \Log::info("Inventory Details synced successfully. Number of rows affected: {$affectedRowsCount}.");

        // Optionally, you can also display this information in the console.
        $this->info("Inventory Details synced successfully. Number of rows affected: {$affectedRowsCount}.");
    }
}
