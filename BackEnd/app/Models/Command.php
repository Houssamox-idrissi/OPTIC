<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Command extends Model
{
    use HasFactory;

    protected $fillable = ['date', 'prix', 'ordonnance','medecin','remise','reste','avance', 'status' , 'notes','admin_id'];



    public function clients()
    {
        return $this->belongsToMany(Client::class, 'client_command');
    }

    public function glasses()
    {
        return $this->belongsToMany(Glasse::class, 'glasse_command', 'command_id', 'glasse_id');
    }

    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }
}

