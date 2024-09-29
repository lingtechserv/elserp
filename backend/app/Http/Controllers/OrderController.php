<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    // Get all orders
    public function index()
    {
        $orders = Order::with(['customer', 'items', 'schedule'])->get();
        return response()->json($orders);
    }

    // Create a new order
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|integer',
            'order_date' => 'required|date',
            'status' => 'required|string',
            'total_amount' => 'required|numeric',
        ]);

        $order = Order::create($validated);
        return response()->json($order, 201);
    }

    // Update an existing order
    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $validated = $request->validate([
            'customer_id' => 'integer',
            'order_date' => 'date',
            'status' => 'string',
            'total_amount' => 'numeric',
        ]);

        $order->update($validated);
        return response()->json($order);
    }
}
