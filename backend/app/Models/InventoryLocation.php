<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Database\Factories\InventoryLocationFactory;
use Illuminate\Support\Collection;

class InventoryLocation extends Model
{
    use HasFactory;

    protected $table = 'InventoryLocations';

    protected $fillable = ['parentlocationid', 'name', 'type', 'description'];

    public function parentLocation()
    {
        return $this->belongsTo(InventoryLocation::class, 'parentlocationid');
    }

    public function children()
    {
        return $this->hasMany(InventoryLocation::class, 'parentlocationid');
    }

    public function getAllParentLocations()
    {
        $parents = new Collection();

        $current = $this->parentLocation;
        while ($current) {
            $parents->push($current);
            $current = $current->parentLocation;
        }

        return $parents;
    }
    
    public function indexOrders()
    {
        $orders = Order::with([
            'customer',
            'items.item',
            'schedule',
            'recipes',
            'items.item.inventoryItems.locations' => function ($query) {
                $query->withPivot(['quantity', 'reorder', 'mqoh']);
            }
        ])->get();

        return response()->json($orders);
    }
}
