<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompletedForm extends Model
{
    use HasFactory;

    protected $fillable = ['type', 'config'];

    protected $casts = [
        'config' => 'array',
    ];
}
