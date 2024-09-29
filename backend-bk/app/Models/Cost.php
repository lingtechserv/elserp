<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cost extends Model
{
    protected $table = 'Costs';
    
    protected $fillable = ['cost', 'unit', 'type'];
}
