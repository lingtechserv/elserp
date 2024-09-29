<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Entity extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    public function forms()
    {
        return $this->belongsToMany(Form::class, 'entity_forms');
    }
}
