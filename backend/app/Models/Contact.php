<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    protected $table = 'Contacts';

    protected $fillable = [
        'customer_id', 'address', 'city', 'state', 'zipcode', 'country', 'firstName', 'lastName'
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}