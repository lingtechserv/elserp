<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupplierInventory extends Model
{
    use HasFactory;

    protected $table = 'SupplierInventory';

    public $timestamps = false;

    protected $fillable = [
        'supplier_id',
        'inventory_id',
        'preferred',
        'lead_time',
        'cost',
    ];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_id');
    }

    public function inventoryItem()
    {
        return $this->belongsTo(InventoryItem::class, 'inventory_id');
    }
}
