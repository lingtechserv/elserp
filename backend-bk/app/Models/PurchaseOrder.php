<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseOrder extends Model
{
    protected $fillable = [
        'supplier_name', 'order_date', 'status', 'total_amount', 'expected_delivery_date'
    ];
}