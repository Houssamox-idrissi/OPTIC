<?php

namespace App\Http\Controllers\API;

use App\Models\Client;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Http\Response;
use Tymon\JWTAuth\Facades\JWTAuth;

class ClientController extends Controller
{
    public function index()
    {
        $admin = JWTAuth::parseToken()->authenticate();
        $clients = Client::where('admin_id',$admin->id)->get();
        return response()->json($clients);
    }

    public function store(Request $request)
    {
        $admin = JWTAuth::parseToken()->authenticate();
        $validatedData = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'telephone' => 'required|string|max:255',
            'assurance' => 'required|string|max:255',
        ]);

        $validatedData['admin_id'] = $admin->id;
        $client = Client::create($validatedData);

        return response()->json($client, Response::HTTP_CREATED);
    }


    public function update(Request $request, $id)
    {
        $client = Client::findOrFail($id);

        $validatedData = $request->validate([
            'nom' => 'sometimes|required|string|max:255',
            'prenom' => 'sometimes|required|string|max:255',
            'assurance' => 'sometimes|required|string|max:255',
        ]);

        $client->update($validatedData);

        return response()->json($client);
    }

    public function destroy($id)
    {
        $admin = JWTAuth::parseToken()->authenticate();
        $client = Client::where('admin_id',$admin->id)->findOrFail($id);
        $client->delete();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
