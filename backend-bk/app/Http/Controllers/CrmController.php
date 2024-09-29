<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Supplier;
use App\Models\Customer;
use App\Models\Contact;
use App\Models\Address;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\InventoryItem;
use App\Models\InventoryLocationJunction;
use App\Models\OrderSchedule;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\SuppliersImport;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class CrmController extends Controller
{
    /**
     * Handle bulk upload of suppliers from JSON data.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function bulkUpload(Request $request)
    {
        $data = $request->validate([
            '*' => 'required|array',
            '*.name' => 'required|string|max:255',
            '*.phone' => 'nullable|string|max:255',
            '*.email' => 'nullable|email|max:255',
            '*.url' => 'nullable|url|max:255',
            '*.notes' => 'nullable|string',
        ]);

        try {
            foreach ($request->all() as $supplierData) {
                Supplier::create([
                    'name' => $supplierData['name'],
                    'phone' => $supplierData['phone'] ?? null,
                    'email' => $supplierData['email'] ?? null,
                    'url' => $supplierData['url'] ?? null,
                    'notes' => $supplierData['notes'] ?? null,
                ]);
            }

            return response()->json(['message' => 'Suppliers uploaded successfully.'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error uploading suppliers: ' . $e->getMessage()], 500);
        }
    }
    public function bulkUploadCustomers(Request $request)
    {
        $data = $request->all();
        
        // Validate each customer data in the request
        $validator = Validator::make($data, [
            '*' => 'required|array',
            '*.name' => 'required|string|max:255',
            '*.url' => 'nullable|string|max:255',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }
        
        try {
            foreach ($data as $customerData) {
                Customer::create([
                    'name' => $customerData['name'],
                    'url' => $customerData['url'] ?? null,
                ]);
            }

            return response()->json(['message' => 'Customers uploaded successfully.'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error uploading customers: ' . $e->getMessage()], 500);
        }
    }
    public function bulkUploadAddresses(Request $request)
    {
        $data = $request->validate([
            '*' => 'required|array',
            '*.AddressLine1' => 'required|string|max:255',
            '*.AddressLine2' => 'nullable|string|max:255',
            '*.AddressLine3' => 'nullable|string|max:255',
            '*.AddressLine4' => 'nullable|string|max:255',
            '*.City' => 'required|string|max:255',
            '*.County' => 'nullable|string|max:255',
            '*.PostCode' => 'required|string|max:255',
            '*.Country' => 'nullable|string|max:255',
            '*.Type' => 'required|string|max:255',
            '*.supplier_id' => 'nullable|integer|exists:Suppliers,id',
            '*.customer_id' => 'nullable|integer|exists:Customers,id',
        ]);

        try {
            foreach ($data as $addressData) {
                Address::create($addressData);
            }

            return response()->json(['message' => 'Addresses uploaded successfully.'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error uploading addresses: ' . $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
{
    // Validate the incoming data
    $validatedData = $request->validate([
        'name' => 'required|string|max:255',
        'physicalAddress' => 'required|string',
        'billingAddress' => 'required_if:sameAddress,false|string',
        'accountNumber' => 'nullable|string', 
        'terms' => 'required|string',
        'otherTerms' => 'nullable|string', 
        'credit' => 'nullable|numeric',
        'sameAddress' => 'required|boolean',
        'website' => 'nullable|string', 
        'contacts' => 'required|array',
        'contacts.*.firstName' => 'required_without_all:contacts.*.lastName,contacts.*.title,contacts.*.email,contacts.*.phone|string',
        'contacts.*.lastName' => 'nullable|string',
        'contacts.*.title' => 'nullable|string',
        'contacts.*.email' => 'nullable|email',
        'contacts.*.phone' => 'nullable|string',
        'contacts.*.billing' => 'boolean',
    ]);

    // Create the Customer and the Main Contact
    $customer = Customer::create([
        'name' => $validatedData['name'],
        'url' => $validatedData['website'],
        'accountNumber' => $validatedData['accountNumber'],
        'credit' => $validatedData['credit']
    ]);

    // Create the Addresses
    $physicalAddress = new Address([
        'AddressLine1' => $validatedData['physicalAddress'],
        'Type' => 'Physical',
        'customer_id' => $customer->id, 
    ]);

    $customer->addresses()->save($physicalAddress);

    if (!$validatedData['sameAddress']) {
        $billingAddress = new Address([
            'AddressLine1' => $validatedData['billingAddress'],
            'Type' => 'Billing',
            'customer_id' => $customer->id, 
        ]);

        $customer->addresses()->save($billingAddress); 
    }

    // Create the other Contacts
    foreach ($validatedData['contacts'] as $contactData) {
        $contact = new Contact([
            'firstName' => $contactData['firstName'],
            'lastName' => $contactData['lastName'],
            'title' => $contactData['title'],
            'email' => $contactData['email'],
            'phone' => $contactData['phone'],
            'billing' => $contactData['billing'],
            'customer_id' => $customer->id, 
        ]);
        $customer->contacts()->save($contact);
    }

    return response()->json(['message' => 'Customer created successfully', 'customer' => $customer], 201);
}

public function index()
{
    // Eager Load Relationships
    $customers = Customer::with('contacts', 'orders', 'addresses')->get();
    
    return response()->json($customers);
}

public function storeOrder(Request $request)
    {
        // Data validation
        $validator = Validator::make($request->all(), [
            'customer_id' => 'required|exists:Customers,id',
            'lineItems' => 'required|array',
            'lineItems.*.product_id' => 'required|exists:InventoryItems,id',
            'lineItems.*.quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Calculate total amount (you might need to adjust based on your pricing logic)
        $totalAmount = 0;
        foreach ($request->lineItems as $lineItem) {
            $product = InventoryItem::find($lineItem['product_id']);
            $totalAmount += $product->price * $lineItem['quantity'];
        }

        // Use a database transaction to ensure atomicity
        DB::transaction(function () use ($request, $totalAmount) { 
            // Create the Order
            $order = Order::create([
                'customer_id' => $request->customer_id,
                'order_date' => now(),
                'status' => 'pending',
                'total_amount' => $totalAmount,
            ]);

            // Create OrderItems and update InventoryItems
            foreach ($request->lineItems as $lineItem) {
                $product = InventoryItem::find($lineItem['product_id']);

                // Update 'ordered' quantity in InventoryItems table
                $product->ordered += $lineItem['quantity'];
                $product->save();

                OrderItem::create([
                    'order_id' => $order->id,
                    'item_id' => $product->id,
                    'item_type' => get_class($product),
                    'quantity' => $lineItem['quantity'],
                ]);

                // Schedule order based on inventory and reorder levels
                $this->scheduleOrderBasedOnInventory($order, $product, $lineItem['quantity']);
            }
        }); 

        return response()->json(['message' => 'Order created and scheduled successfully'], 201);
    }
    private function scheduleOrderBasedOnInventory(Order $order, InventoryItem $product, $quantity)
    {
        $totalStock = InventoryLocationJunction::where('inventory_id', $product->id) // Corrected column name
            ->sum('quantity');

        $totalReorder = InventoryLocationJunction::where('inventory_id', $product->id) // Corrected column name
            ->sum('reorder');

        $stockDifference = $totalStock - $product->ordered;

        // Calculate schedule duration (3/5 of total order minutes)
        $scheduleDurationMinutes = (int)round(($quantity * $product->production_time) * (3/5)); 

        if ($stockDifference > $totalReorder) {
            $order->status = 'scheduled';
            $this->scheduleProduction($order, $scheduleDurationMinutes);
        } elseif ($stockDifference <= $totalReorder && $stockDifference > 0) {
            $order->status = 'Scheduled - Flagged'; 
            $this->scheduleProduction($order, $scheduleDurationMinutes);
        } else {
            $order->status = 'On Hold'; 
        }

        $order->save();
    }

    private function scheduleProduction(Order $order, $durationMinutes)
    {
        // Get the last scheduled order
        $lastScheduledOrder = OrderSchedule::orderBy('end_time', 'desc')->first();

        // Determine the start time based on the last scheduled order
        $startTime = $lastScheduledOrder ? $lastScheduledOrder->end_time : now();

        // Calculate the end time by adding the duration
        $endTime = $startTime->copy()->addMinutes($durationMinutes); 

        OrderSchedule::create([
            'order_id' => $order->id,
            'equipment_id' => 1, // You might need logic to determine the equipment ID
            'schedule_start' => $startTime, // Assuming schedule_start is the field name
            'schedule_end' => $endTime,   // Assuming schedule_end is the field name
        ]);
    }
public function indexOrders()
{
    // Fetch all orders with related data
    $orders = Order::with([
        'customer',
        'items.item',
        'schedule',
        'items.item.locations' => function ($query) {
            $query->withPivot(['quantity', 'reorder', 'mqoh']);
        }
    ])->get();

    // Return the orders as a JSON response (or you can format it as needed)
    return response()->json($orders);
}
}