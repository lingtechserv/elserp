<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EntityForm extends Model
{
    use HasFactory;

    protected $fillable = ['entity_id', 'form_id'];

    public function entity()
    {
        return $this->belongsTo(Entity::class);
    }

    public function form()
    {
        return $this->belongsTo(Form::class);
    }
}
