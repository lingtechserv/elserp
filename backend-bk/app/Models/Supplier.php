<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Database\Factories\SupplierTableFactory;

class Supplier extends Model
{
    use HasFactory;

    protected $table = 'Suppliers';

    protected $fillable = ['name', 'phone', 'email', 'url', 'notes'];

    public function inventoryItems()
    {
    return $this->belongsToMany(InventoryItem::class, 'SupplierInventory', 'supplier_id', 'inventory_id')
                ->using(SupplierInventory::class)
                ->withPivot('preferred', 'lead_time', 'cost')
                ->withTimestamps();
    }

    public function addresses()
    {
        return $this->hasMany('App\Models\Address', 'supplier_id');
    }
}
