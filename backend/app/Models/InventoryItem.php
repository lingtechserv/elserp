<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryItem extends Model
{
    use HasFactory;

    protected $table = 'InventoryItems';

    protected $fillable = [
        'sku', 'name', 'type', 'category', 'subcat', 'active', 'throughput', 'ordered'
    ];

    protected $casts = [
        'active' => 'boolean',
    ];

    protected $dates = [
        'created_at', 'updated_at'
    ];

    public function details()
    {
        return $this->belongsToMany(Detail::class, 'InventoryDetails', 'inventory_id', 'details_id')
                    ->withPivot('value', 'required')
                    ->withTimestamps();
    }
    
    public function suppliers()
    {
        return $this->belongsToMany(Supplier::class, 'SupplierInventory', 'inventory_id', 'supplier_id')
                    ->withPivot('preferred', 'lead_time', 'cost');
    }

    public function locations()
    {
        return $this->belongsToMany(InventoryLocation::class, 'InventoryLocationJunction', 'inventory_id', 'location_id')
                    ->using(InventoryLocationJunction::class)
                    ->withPivot(['quantity', 'reorder', 'mqoh'])
                    ->withTimestamps();
    }
}