<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Option extends Model
{
    protected $table = 'Options';

    protected $fillable = [
        'parent_id',
        'details_id',
        'option',
        'type',
    ];

    public $timestamps = true;

    protected $keyType = 'int';

    public function detail()
    {
        return $this->belongsTo(Detail::class, 'details_id');
    }

    public function parent()
    {
        return $this->belongsTo(Option::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Option::class, 'parent_id');
    }
}
