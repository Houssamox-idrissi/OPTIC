<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Type_verre extends Model
{
    use HasFactory;
    protected $fillable = [
        'libelle',
        'admin_id'
    ];

    public function glasses()
    {
        return $this->hasMany(Glasse::class);
    }

    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }
}
