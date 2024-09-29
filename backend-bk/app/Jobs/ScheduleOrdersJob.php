<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class ScheduleOrdersJob
{
    public function handle()
    {
        DB::beginTransaction();
        try {
            // Fetch pending orders
            $orders = Order::with([
                'customer',
                'items.item',
                'schedule',
                'items.item.locations' => function ($query) {
                    $query->withPivot(['quantity', 'reorder', 'mqoh']);
                }
            ])->where('status', 'pending')->get();

            // Calculate and sort orders by trigger
            $sortedOrders = $this->sortOrdersByTrigger($orders);

            // Schedule orders
            $priorityIndex = 0;
            foreach ($sortedOrders as $order) {
                $this->scheduleOrder($order, $priorityIndex);
                $priorityIndex++;
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to schedule orders: ' . $e->getMessage());
        }
    }

    private function calculateDaysToTrigger($item)
    {
        $currentStock = $item->locations->sum('pivot.quantity');
        $currentOrder = $item->quantity;
        $throughputPerDay = $item->throughput;
        $reorderPoint = $item->locations->first()->pivot->reorder;

        $daysToTrigger = ($currentStock - $reorderPoint) / $throughputPerDay;
        return $daysToTrigger;
    }

    private function sortOrdersByTrigger($orders)
    {
        foreach ($orders as $order) {
            $order->days_to_trigger = $this->calculateDaysToTrigger($order->items->first()->item);
        }
        $sortedOrders = $orders->sortBy('days_to_trigger');
        return $sortedOrders;
    }

    private function scheduleOrder($order, $priorityIndex)
    {
        $daysToTrigger = $order->days_to_trigger;
        $scheduledDate = Carbon::now()->addDays($daysToTrigger + $priorityIndex);

        $order->status = 'scheduled';
        $order->schedule->schedule_start = $scheduledDate;
        $order->schedule->schedule_end = $scheduledDate->copy()->addHours(4); // Example 4-hour production time
        $order->save();
    }
}
