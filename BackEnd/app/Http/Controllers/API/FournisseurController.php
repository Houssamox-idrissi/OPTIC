<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Fournisseur;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Tymon\JWTAuth\Facades\JWTAuth;

class FournisseurController extends Controller
{
    public function index()
    {
        $admin = JWTAuth::parseToken()->authenticate();
        $fournisseurs = Fournisseur::where('admin_id', $admin->id)->get();
        return response()->json($fournisseurs);
    }


    public function store(Request $request)
    {
        $admin = JWTAuth::parseToken()->authenticate();
        $validateData = $request->validate([
            'marque' => 'required|string|max:255',
            'telephone' => 'required|string|max:15',
            'address' => 'required|string|max:255',
        ]);
        $validateData['admin_id']=$admin->id;

        $fournisseur = Fournisseur::create($validateData);

        return response()->json($fournisseur, Response::HTTP_CREATED);
    }


    public function show($id)
    {
        $fournisseur = Fournisseur::findOrFail($id);
        return response()->json($fournisseur);
    }


    public function update(Request $request, $id)
    {
        $request->validate([
            'marque' => 'sometimes|required|string|max:255',
            'telephone' => 'sometimes|required|string|max:15',
            'address' => 'sometimes|required|string|max:255',
        ]);

        $fournisseur = Fournisseur::findOrFail($id);
        $fournisseur->update($request->all());

        return response()->json($fournisseur, Response::HTTP_OK);
    }


    public function destroy($id)
    {
        $admin = JWTAuth::parseToken()->authenticate();
        $fournisseur = Fournisseur::where('admin_id',$admin->id)->findOrFail($id);
        $fournisseur->delete();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }

}
