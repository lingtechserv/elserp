<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Recipe extends Model
{
    protected $fillable = [
        'name', 'details', 'active'
    ];

    public function ingredients()
    {
        return $this->belongsToMany(InventoryItem::class, 'recipe_ingredient', 'recipe_id', 'ingredient_id')
                    ->withPivot('type', 'density', 'cntr', 'pg', 'vg', 'percent')
                    ->withTimestamps();
    }
}