<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Glasse extends Model
{
    use HasFactory;

    protected $fillable = [
        'type_verre_id',
        'nature_de_glasse',
        'og_sph',
        'og_cyl',
        'og_axe',
        'og_addition',
        'od_sph',
        'od_cyl',
        'od_axe',
        'od_addition',
        'fournisseur_id',
        'vision',
        'admin_id'
    ];

    public function typeVerre()
    {
        return $this->belongsTo(Type_verre::class, 'type_verre_id');
    }


    public function commands()
    {
        return $this->belongsToMany(Command::class, 'glasse_command', 'glasse_id', 'command_id');
    }


    public function fournisseur()
    {
        return $this->belongsTo(Fournisseur::class);
    }

}
