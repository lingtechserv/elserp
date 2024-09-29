<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class InventoryLocationJunction extends Pivot
{
    protected $table = 'InventoryLocationJunction';

    protected $fillable = ['inventory_id', 'location_id', 'quantity', 'reorder', 'mqoh'];

    public $timestamps = true;

    public function inventoryItem()
    {
        return $this->belongsTo(InventoryItem::class, 'inventory_id');
    }

    public function location()
    {
        return $this->belongsTo(InventoryLocation::class, 'location_id');
    }
}
