<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryDetail extends Model
{
    use HasFactory;

    protected $table = 'InventoryDetails';

    protected $fillable = [
        'inventory_id', 'details_id', 'value', 'required'
    ];

    protected $dates = [
        'created_at', 'updated_at'
    ];
}
