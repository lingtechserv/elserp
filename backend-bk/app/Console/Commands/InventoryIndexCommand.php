<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Jobs\InventoryIndexJob;
use Illuminate\Support\Facades\Auth;

class InventoryIndexCommand extends Command
{
    protected $signature = 'inventory:index';
    protected $description = 'Index all inventory';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        // Assuming you have a method to get or create a user for this task
        $user = $this->getUserForInventoryIndexing();

        dispatch(new InventoryIndexJob($user));

        $this->info('Inventory indexing job dispatched.');
    }

    private function getUserForInventoryIndexing()
    {
        // Implement logic to retrieve or create a user for this task
        // For example, using a predefined admin user
        return Auth::user(); // Modify as needed
    }
}
