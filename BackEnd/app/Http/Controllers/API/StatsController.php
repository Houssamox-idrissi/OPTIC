<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\Command;
use Carbon\Carbon;

use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Facades\JWTAuth;

class StatsController extends Controller
{
    public function getEarnings()
{
    $admin = JWTAuth::parseToken()->authenticate();

    $monthlyEarnings = Command::where('admin_id', $admin->id)
        ->selectRaw('MONTH(date) as month, YEAR(date) as year, SUM(prix) as earnings, COUNT(id) as total_commands')
        ->groupBy('month', 'year')
        ->orderBy('year', 'asc')
        ->orderBy('month', 'asc')
        ->get();

    Carbon::setLocale('fr');

    $monthlyEarnings = $monthlyEarnings->map(function ($item) {
        $item->month_name = Carbon::createFromDate(null, $item->month)->translatedFormat('F');
        return $item;
    });

    return response()->json($monthlyEarnings);
}

}
