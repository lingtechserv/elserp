<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrderSchedule extends Model
{
    use SoftDeletes;
    
    protected $table = 'OrderSchedules';

    protected $fillable = [
        'order_id', 'equipment_id', 'start_time', 'end_time', 'schedule_start', 'schedule_end'
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function equipment()
    {
        return $this->belongsTo(Equipment::class);
    }
}