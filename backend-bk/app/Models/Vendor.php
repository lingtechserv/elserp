<?php

use Illuminate\Database\Eloquent\Model;

class Vendor extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'contact_information',
        'type_of_goods_services',
        'address_line_1',
        'address_line_2',
        'town_city',
        'county',
        'postcode',
        'latitude',
        'longitude',
    ];

    protected $casts = [
        'latitude' => 'decimal:6',
        'longitude' => 'decimal:6',
    ];
}