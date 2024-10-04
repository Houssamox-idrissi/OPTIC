<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fournisseur extends Model
{
    use HasFactory;

    protected $fillable = ['marque', 'telephone', 'address','admin_id'];


    public function glasses()
    {
        return $this->belongsToMany(Glasse::class, 'd_fournisseurs_glasses', 'fournisseur_id', 'glasse_id')
            ->withTimestamps();
    }

    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }
}
