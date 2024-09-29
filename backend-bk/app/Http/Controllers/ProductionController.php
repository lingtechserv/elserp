<?php

namespace App\Http\Controllers;

use App\Models\Equipment;
use App\Models\Order;
use App\Models\OrderSchedule;
use App\Models\User;
use Illuminate\Http\Request;

class ProductionController extends Controller
{
    public function getEquipment()
    {
        $equipment = Equipment::all();
        return response()->json($equipment);
    }

    public function getProductionUsers()
    {
        $users = User::role(['production', 'production-manager'])
                     ->get(['first_name', 'last_name', 'equipment_id']);

        return response()->json($users);
    }

    public function getUnassignedOrders()
    {
        $orders = Order::whereDoesntHave('schedule')->get();
        return response()->json($orders);
    }

    public function scheduleOrder(Request $request)
    {
        $data = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'equipment_id' => 'required|exists:equipment,id',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
        ]);

        $orderSchedule = OrderSchedule::updateOrCreate(
            ['order_id' => $data['order_id']],
            [
                'equipment_id' => $data['equipment_id'],
                'start_time' => $data['start_time'],
                'end_time' => $data['end_time'],
            ]
        );

        return response()->json($orderSchedule);
    }

    public function updateTimes(Request $request)
{
    $data = $request->validate([
        'schedule_id' => 'required|exists:OrderSchedules,id', // Assuming schedule_id is the primary key of OrderSchedules
        'start_time' => 'nullable|date',
        'end_time' => 'nullable|date', 
    ]);

    $orderSchedule = OrderSchedule::find($data['schedule_id']);

    if (!$orderSchedule) {
        return response()->json(['error' => 'Schedule not found'], 404);
    }

    // Conditionally update start_time or end_time
    if (isset($data['start_time'])) {
        $orderSchedule->start_time = $data['start_time']; 
    }

    if (isset($data['end_time'])) {
        // Only update end_time if it's after start_time
        if (isset($data['start_time']) && $data['end_time'] <= $data['start_time']) {
            return response()->json(['error' => 'End time must be after start time'], 400);
        }
        $orderSchedule->end_time = $data['end_time'];
    }

    $orderSchedule->save();

    return response()->json($orderSchedule);
}
}