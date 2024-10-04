<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Type_verre;
use Illuminate\Http\Response;
use Tymon\JWTAuth\Facades\JWTAuth;

class TypeVerreController extends Controller
{
    public function index()
    {
        $admin = JWTAuth::parseToken()->authenticate();
        $typeVerres = Type_verre::where('admin_id', $admin->id)->get();
        return response()->json($typeVerres);
    }

    public function store(Request $request)
    {
        $admin = JWTAuth::parseToken()->authenticate();
        $validatedData = $request->validate([
            'libelle' => 'required|string|max:255',
        ]);

        $validatedData['admin_id']=$admin->id;
        $typeVerre = Type_verre::create($validatedData);

        return response()->json($typeVerre, Response::HTTP_CREATED);
    }

    public function show($id)
    {
        $typeVerre = Type_verre::findOrFail($id);

        return response()->json($typeVerre);
    }

    public function update(Request $request, $id)
    {
        $typeVerre = Type_verre::findOrFail($id);

        $validatedData = $request->validate([
            'libelle' => 'sometimes|required|string|max:255',
        ]);

        $typeVerre->update($validatedData);

        return response()->json($typeVerre);
    }

    public function destroy($id)
    {
        $admin = JWTAuth::parseToken()->authenticate();
        $typeVerre = Type_verre::where('admin_id',$admin->id)->findOrFail($id);
        $typeVerre->delete();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
