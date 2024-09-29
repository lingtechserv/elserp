<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $table = 'OrderItems';

    protected $fillable = [
        'order_id',
        'item_id',
        'item_type',
        'quantity'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    public function item()
    {
        return $this->morphTo('item', 'item_type', 'item_id');
    }
}