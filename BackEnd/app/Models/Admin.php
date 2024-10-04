<?php

namespace App\Models;

use App\Http\Controllers\API\FournisseurController;
use App\Http\Controllers\API\TypeVerreController;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class Admin extends Authenticatable implements JWTSubject
{
    use  Notifiable;

    protected $fillable = ['name', 'prenom', 'email', 'password'];

    protected $hidden = ['password', 'remember_token'];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    public function commands(){
        return $this->hasMany(Command::class);
    }

    public function clients(){
        return $this->hasMany(Client::class);
    }
    public function glasses(){
        return $this->hasMany(Glasse::class);
    }

    public function typeVerre(){
        return $this->hasMany(TypeVerreController::class);
    }

    public function Fournisseurs(){
        return $this->hasMany(FournisseurController::class);
    }
}
