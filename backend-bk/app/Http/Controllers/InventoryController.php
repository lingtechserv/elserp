<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Jobs\InventoryIndexJob;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\Option;
use App\Models\Cost;
use App\Models\Supplier;
use App\Models\InventoryLocation;
use App\Models\InventoryItem;
use App\Models\InventoryDetail;
use App\Models\SupplierInventory;
use App\Models\Detail;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Imports\InventoryImport;


class InventoryController extends Controller
{
    public function index()
{
    $inventoryItems = InventoryItem::with(['details', 'suppliers', 'locations'])->get()->map(function ($item) {
        // Nest specified columns under 'basics'
        $item->basics = [
            'id' => $item->id,
            'sku' => $item->sku,
            'name' => $item->name,
            'type' => $item->type,
            'category' => $item->category,
            'subcat' => $item->subcat,
            'active' => $item->active,
            'created' => $item->created_at,
            'updated' => $item->updated_at
        ];

        // Optionally remove these attributes from the root of the item if you want them only under 'basics'
        unset($item->id, $item->sku, $item->name, $item->type, $item->category, $item->subcat, $item->active, $item->created_at, $item->updated_at);

        return $item;
    });

    return response()->json($inventoryItems);
}


    public function indexAllInventory(Request $request)
    {
        if (!Auth::guard('api')->check()) {
            return response()->json(['message' => 'Unauthorized access'], 401);
        }

        $user = Auth::guard('api')->user();
        $allInventory = [];

        $inventoryModels = [
            ['model' => BulkELiquid::class, 'type' => 1],
            ['model' => FlavourConcentrate::class, 'type' => 2],
            ['model' => Hardware::class, 'type' => 3],
            ['model' => Product::class, 'type' => 4],
            ['model' => RawMaterial::class, 'type' => 5],
            ['model' => Miscellaneous::class, 'type' => 6],
        ];

        foreach ($inventoryModels as $inventory) {
            $modelClass = $inventory['model'];
            $type = $inventory['type'];
            
            $items = $modelClass::with(['costs', 'options.children', 'locations.parentLocation', 'suppliers'])->get();
            foreach ($items as $item) {
                $formattedItem = $this->formatInventoryItem($item, $type);
                $allInventory[] = $formattedItem;
            }
        }

        return response()->json($allInventory);
    }

    private function formatInventoryItem($item, $type)
{
    // Initialize the basics array
    $basics = [
        'sku' => $item->sku,
        'name' => $item->name,
        'description' => $item->description ?? '',
        'active' => $item->active,
        'category' => $item->getAttributeValue('category') ?? null,
        'subcategory' => $item->getAttributeValue('subcategory') ?? null,
    ];

    if (method_exists($item, 'getCategoryAttribute')) {
        $basics['category'] = $item->category;
    }

    if (method_exists($item, 'getSubcategoryAttribute')) {
        $basics['subcategory'] = $item->subcategory;
    }

    // Retrieve cost data
    $costs = $item->costs->map(function ($cost) {
        return [
            'cost' => $cost->cost,
            'unit' => $cost->unit,
            'type' => $cost->type,
        ];
    })->toArray();

    // Retrieve stock data
    $stock = $this->getFormattedLocationDetails($item);
    
    $details = $item->options->map(function ($option) {
        return $this->formatOption($option);
    })->toArray();

    return [
        'id' => $item->id,
        'type' => $type,
        'basics' => $basics,
        'details' => $details,
        'costs' => $costs,
        'stock' => $stock,
    ];
}

public function formatOption($option)
{
    $formattedOption = [
        'id' => $option->id,
        'name' => $option->option, // Ensure you're accessing the right attribute for the option's name.
        'type' => $option->type,
        'value' => $option->pivot->value ?? null, // Correctly accessing the pivot data for the 'value'.
    ];

    if ($option->children->isNotEmpty()) {
        $formattedOption['children'] = $option->children->map(function ($childOption) {
            return $this->formatOption($childOption);
        })->toArray();
    }

    return $formattedOption;
}


    private function getFormattedLocationDetails($item)
    {
        return $item->locations->map(function ($location) {
            // Aggregate the hierarchy of locations
            $hierarchy = [];
            $currentLocation = $location;
            while ($currentLocation->parentLocation !== null) {
                $hierarchy[] = $currentLocation->parentLocation->name;
                $currentLocation = $currentLocation->parentLocation;
            }
            $fullHierarchy = implode(' > ', array_reverse($hierarchy)) . ' > ' . $location->name;
    
            // Determine RAG status based on stock quantity
            $quantity = $location->pivot->quantity;
            $mqoh = $location->pivot->mqoh;
            $reorder = $location->pivot->reorder;
            $status = $this->calculateRagStatus($quantity, $mqoh, $reorder);
    
            return [
                'location_hierarchy' => $fullHierarchy,
                'quantity' => $quantity,
                'mqoh' => $mqoh,
                'reorder' => $reorder,
                'status' => $status,
            ];
        })->toArray();
    }
    
    private function calculateRagStatus($quantity, $mqoh, $reorder)
    {
        if ($quantity <= $mqoh) {
            return 'Red';
        } elseif ($quantity > $mqoh && $quantity <= $reorder) {
            return 'Amber';
        } else { // $quantity > $reorder
            return 'Green';
        }
    }

public function createInventoryLocation(Request $request)
{
    $locationData = $request->all();
    $locationType = $locationData['type'];
    $inventoryLocation = InventoryLocation::create([
        'name' => $locationData['name'],
        'type' => $locationType,
        'description' => $locationData['description'] ?? null,
        'parentlocationid' => null
    ]);

    if ($locationType === 'Warehouse') {
        foreach ($locationData['sections'] as $sectionIndex => $section) {
            $sectionLocation = InventoryLocation::create([
                'name' => $section['name'],
                'type' => 'section',
                'parentlocationid' => $inventoryLocation->id
            ]);

            foreach ($section['rows'] as $rowIndex => $row) {
                $rowName = strval($rowIndex + 1);
                $rowLocation = InventoryLocation::create([
                    'name' => $rowName,
                    'type' => 'row',
                    'parentlocationid' => $sectionLocation->id
                ]);

                foreach ($row['shelves'] as $shelfIndex => $shelf) {
                    $shelfName = chr(65 + $shelfIndex);
                    $shelfLocation = InventoryLocation::create([
                        'name' => $shelfName,
                        'type' => 'shelf',
                        'parentlocationid' => $rowLocation->id
                    ]);

                    for ($binIndex = 0; $binIndex < $shelf['bins']; $binIndex++) {
                        InventoryLocation::create([
                            'name' => strval($binIndex + 1),
                            'type' => 'bin',
                            'parentlocationid' => $shelfLocation->id
                        ]);
                    }
                }
            }
        }
    }

    return $inventoryLocation;
}
public function getInventoryLocations()
{
    if (!Auth::check()) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    $user = Auth::user();

    $locations = [];
    $sections = [];
    $rows = [];
    $shelves = [];
    $bins = [];

    if ($user->can('view-warehouse-inventory')) {
        $warehouses = InventoryLocation::where('type', 'Warehouse')
                                       ->get(['id', 'name', 'type', 'description']);
        $locations = array_merge($locations, $warehouses->toArray());

        foreach ($warehouses as $warehouse) {
            $sections = array_merge($sections, $warehouse->children()->where('type', 'Section')->get(['id', 'name', 'parentlocationid'])->toArray());
        }

        $rows = InventoryLocation::where('type', 'Row')->get(['id', 'name', 'parentlocationid']);
        $shelves = InventoryLocation::where('type', 'Shelf')->get(['id', 'name', 'parentlocationid']);
        $bins = InventoryLocation::where('type', 'Bin')->get(['id', 'name', 'parentlocationid']);
    }

    if ($user->can('view-vendor-inventory')) {
        $vendors = InventoryLocation::where('type', 'Vendor')->get(['id', 'name', 'type', 'description']);
        $locations = array_merge($locations, $vendors->toArray());
    }

    if ($user->can('view-retail-inventory')) {
        $retails = InventoryLocation::where('type', 'Retail')->get(['id', 'name', 'type', 'description']);
        $locations = array_merge($locations, $retails->toArray());
    }

    return response()->json([
        'locations' => $locations,
        'sections'  => $sections,
        'rows'      => $rows,
        'shelves'   => $shelves,
        'bins'      => $bins,
    ]);
}
public function getAllSuppliers()
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $suppliers = Supplier::all();

        return response()->json(['suppliers' => $suppliers]);
    }
    public function createSupplier(Request $request)
    {
        $validatedData = $request->validate([
            'supplier_name' => 'required|string|max:255',
            'contact_phone' => 'nullable|string',
            'contact_email' => 'nullable|email',
            'contact_url' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);
    
        $supplier = Supplier::create([
            'name' => $validatedData['supplier_name'],
            'phone' => $validatedData['contact_phone'],
            'email' => $validatedData['contact_email'],
            'url' => $validatedData['contact_url'],
            'notes' => $validatedData['notes'],
        ]);
    
        return response()->json(['message' => 'Supplier created successfully', 'supplier' => $supplier], 201);
    }
    
    public function getOptionsWithChildren(Request $request)
    {
        $options = Option::where('type', 2)->get();

        $structuredOptions = $options->map(function ($option) {
            return $this->structureOption($option);
        });

        return response()->json(['options' => $structuredOptions]);
    }

    protected function structureOption($option)
{
    $structured = [
        'id' => $option->id,
        'option' => $option->option,
        'children' => []
    ];

    $children = $option->children;
    if ($children->isNotEmpty()) {
        foreach ($children as $child) {
            $structured['children'][] = $this->structureOption($child);
        }
    }

    return $structured;
}
public function bulkUpload(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:csv,txt',
        ]);

        $file = $request->file('file');

        Excel::import(new InventoryImport, $file); // Now it will work! 

        return response()->json(['message' => 'Inventory uploaded successfully']);
    }
}