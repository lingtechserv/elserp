<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Jobs\ScheduleOrdersJob;

class ScheduleOrdersCommand extends Command
{
    protected $signature = 'orders:schedule';
    protected $description = 'Schedule pending orders every 30 minutes';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        ScheduleOrdersJob::dispatch();
        $this->info('Scheduled Orders Job dispatched.');
    }
}

