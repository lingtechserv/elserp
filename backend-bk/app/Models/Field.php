<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Field extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'type', 'config'];

    protected $casts = [
        'config' => 'array',
    ];

    public function formFields()
    {
        return $this->hasMany(FormField::class);
    }
}
