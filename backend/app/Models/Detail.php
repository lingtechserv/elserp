<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Detail extends Model
{
    use HasFactory;

    protected $table = 'Details';

    protected $fillable = [
        'name', 'format', 'type', 'category', 'subcat', 'required'
    ];

    protected $dates = [
        'created_at', 'updated_at'
    ];

    public function inventoryItems()
    {
        return $this->belongsToMany(InventoryItem::class, 'inventory_details', 'details_id', 'inventory_id')
                    ->withPivot('value', 'required')
                    ->withTimestamps();
    }

    public function options()
    {
        return $this->hasMany(Option::class, 'details_id');
    }
}
