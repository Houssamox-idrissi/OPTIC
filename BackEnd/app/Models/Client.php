<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $fillable = ['nom', 'prenom', 'assurance','telephone','admin_id'];

    public function commands()
    {
        return $this->belongsToMany(Command::class, 'client_command');
    }
}
