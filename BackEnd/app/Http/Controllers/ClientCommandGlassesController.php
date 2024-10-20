<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Command;
use App\Models\Glasse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Tymon\JWTAuth\Facades\JWTAuth;

class ClientCommandGlassesController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:admin');
    }

    public function store(Request $request)
    {
        $admin = JWTAuth::parseToken()->authenticate();

        $validatedData = $request->validate([
            'nom' => 'nullable|string',
            'prenom' => 'nullable|string',
            'telephone' => 'nullable|string',
            'assurance' => 'nullable|string',
            'client_id' => 'nullable|exists:clients,id',
            'date' => 'nullable|date',
            'medecin' => 'nullable|string',
            'prix' => 'nullable|numeric',
            'avance' => 'nullable|numeric',
            'notes' => 'nullable|string',
            'remise' => 'nullable|numeric',
            'reste' => 'nullable|numeric',
            'ordonnance' => 'nullable',
            'type_verre_id' => 'nullable|exists:type_verres,id',
            'nature_de_glasse' => 'nullable|string',
            'vision' => 'nullable|string',
            'og_sph' => 'nullable|numeric',
            'og_cyl' => 'nullable|numeric',
            'og_axe' => 'nullable|numeric',
            'og_addition' => 'nullable|numeric',
            'od_sph' => 'nullable|numeric',
            'od_cyl' => 'nullable|numeric',
            'od_axe' => 'nullable|numeric',
            'od_addition' => 'nullable|numeric',
            'fournisseur_id' => 'nullable|exists:fournisseurs,id'
        ]);

        if ($request->has('client_id')) {
            $client = Client::where('admin_id', $admin->id)->find($validatedData['client_id']);
        } else {
            $client = Client::where('nom', $validatedData['nom'])
                ->where('prenom', $validatedData['prenom'])
                ->where('telephone', $validatedData['telephone'])
                ->where('admin_id', $admin->id)
                ->first();

            if (!$client) {
                $client = Client::create([
                    'nom' => $validatedData['nom'],
                    'prenom' => $validatedData['prenom'],
                    'telephone' => $validatedData['telephone'],
                    'assurance' => $validatedData['assurance'],
                    'admin_id' => $admin->id,
                ]);
            }
        }

        $fileName = $request->hasFile('ordonnance') ? $request->file('ordonnance')->store('ordonnances') : null;

        $command = Command::create([
            'date' => $validatedData['date'] ?? now(),
            'medecin' => $validatedData['medecin'],
            'prix' => $validatedData['prix'],
            'avance' => $validatedData['avance'],
            'notes' => $validatedData['notes'],
            'remise' => $validatedData['remise'],
            'reste' => $validatedData['reste'],
            'status' => 'Pending',
            'ordonnance' => $fileName,
            'admin_id' => $admin->id,
        ]);

        $command->clients()->attach($client->id);

        $glasses = Glasse::create([
            'type_verre_id' => $validatedData['type_verre_id'],
            'nature_de_glasse' => $validatedData['nature_de_glasse'],
            'vision' => $validatedData['vision'],
            'og_sph' => $validatedData['og_sph'],
            'og_cyl' => $validatedData['og_cyl'],
            'og_axe' => $validatedData['og_axe'],
            'og_addition' => $validatedData['og_addition'],
            'od_sph' => $validatedData['od_sph'],
            'od_cyl' => $validatedData['od_cyl'],
            'od_axe' => $validatedData['od_axe'],
            'od_addition' => $validatedData['od_addition'],
            'fournisseur_id' => $validatedData['fournisseur_id'],
            'admin_id' => $admin->id,
        ]);

        $command->glasses()->attach($glasses->id);

        return response()->json([
            'message' => 'Client, Command, and Glasses created successfully!',
            'client' => $client,
            'command' => $command,
            'glasses' => $glasses,
        ]);
    }


    public function update(Request $request, $id)
    {
        $admin = JWTAuth::parseToken()->authenticate();

        $validatedData = $request->validate([
            'nom' => 'nullable|string',
            'prenom' => 'nullable|string',
            'telephone' => 'nullable|string',
            'assurance' => 'nullable|string',
            'client_id' => 'nullable|exists:clients,id',
            'date' => 'nullable|date',
            'medecin' => 'nullable|string',
            'prix' => 'nullable|numeric',
            'avance' => 'nullable|numeric',
            'notes' => 'nullable|string',
            'remise' => 'nullable|numeric',
            'reste' => 'nullable|numeric',
            'ordonnance' => 'nullable',
            'type_verre_id' => 'nullable|exists:type_verres,id',
            'nature_de_glasse' => 'nullable|string',
            'vision' => 'nullable|string',
            'og_sph' => 'nullable|numeric',
            'og_cyl' => 'nullable|numeric',
            'og_axe' => 'nullable|numeric',
            'og_addition' => 'nullable|numeric',
            'od_sph' => 'nullable|numeric',
            'od_cyl' => 'nullable|numeric',
            'od_axe' => 'nullable|numeric',
            'od_addition' => 'nullable|numeric',
            'fournisseur_id' => 'nullable|exists:fournisseurs,id'
        ]);

        $command = Command::where('admin_id', $admin->id)->findOrFail($id);


        $client = Client::where('admin_id', $admin->id)->first();
        if ($client) {
            $client->update([
                'nom' => $validatedData['nom'],
                'prenom' => $validatedData['prenom'],
                'telephone' => $validatedData['telephone'],
                'assurance' => $validatedData['assurance']
            ]);
        }else{
            $client= Client::create([
            'nom' => $validatedData['nom'],
            'prenom' => $validatedData['prenom'],
            'telephone' => $validatedData['telephone'],
            'assurance' => $validatedData['assurance']
        ]);
        }

        if ($request->hasFile('ordonnance')) {
            $fileName = $request->file('ordonnance')->store('ordonnances');
            if ($command->ordonnance) {
                Storage::delete($command->ordonnance);
            }
            $command->ordonnance = $fileName;
        }

        // Update command
        $command->update([
            'date' => $validatedData['date'],
            'medecin' => $validatedData['medecin'],
            'prix' => $validatedData['prix'],
            'avance' => $validatedData['avance'],
            'notes' => $validatedData['notes'],
            'remise' => $validatedData['remise'],
            'reste' => $validatedData['reste'],
        ]);

        // Update or create glasses data
        $glasses = $command->glasses()->where('admin_id', $admin->id)->first();

        if ($glasses) {
            $glasses->update([
                'type_verre_id' => $validatedData['type_verre_id'],
                'nature_de_glasse' => $validatedData['nature_de_glasse'],
                'vision' => $validatedData['vision'],
                'og_sph' => $validatedData['og_sph'],
                'og_cyl' => $validatedData['og_cyl'],
                'og_axe' => $validatedData['og_axe'],
                'og_addition' => $validatedData['og_addition'],
                'od_sph' => $validatedData['od_sph'],
                'od_cyl' => $validatedData['od_cyl'],
                'od_axe' => $validatedData['od_axe'],
                'od_addition' => $validatedData['od_addition'],
                'fournisseur_id' => $validatedData['fournisseur_id'],
            ]);
        } else {
            $glasses = Glasse::create([
                'type_verre_id' => $validatedData['type_verre_id'],
                'nature_de_glasse' => $validatedData['nature_de_glasse'],
                'vision' => $validatedData['vision'],
                'og_sph' => $validatedData['og_sph'],
                'og_cyl' => $validatedData['og_cyl'],
                'og_axe' => $validatedData['og_axe'],
                'og_addition' => $validatedData['og_addition'],
                'od_sph' => $validatedData['od_sph'],
                'od_cyl' => $validatedData['od_cyl'],
                'od_axe' => $validatedData['od_axe'],
                'od_addition' => $validatedData['od_addition'],
                'fournisseur_id' => $validatedData['fournisseur_id'],
                'admin_id' => $admin->id,
            ]);

            $command->glasses()->attach($glasses->id);
        }

        return response()->json([
            'message' => 'Client, Command, and Glasses updated successfully!',
            'client' => $client,
            'command' => $command,
            'glasses' => $glasses,
        ]);
    }



    public function index()
    {
        $admin = JWTAuth::parseToken()->authenticate();
        $commands = Command::with(['clients', 'glasses'])
            ->where('admin_id', $admin->id)
            ->get();

        return response()->json([
            'commands' => $commands,
        ]);
    }

    public function show($id)
    {
        $admin = JWTAuth::parseToken()->authenticate();
        $command = Command::with('clients', 'glasses')
            ->where('admin_id', $admin->id)
            ->find($id);

        if (!$command) {
            return response()->json([
                'message' => 'Command not found or not authorized to access this command'
            ], 404);
        }

        return response()->json([
            'message' => 'Command details retrieved successfully!',
            'client' => $command->clients,
            'command' => $command,
            'glasses' => $command->glasses
        ]);
    }

    public function destroy($id)
    {
        $admin = JWTAuth::parseToken()->authenticate();
        $command = Command::where('admin_id', $admin->id)->find($id);

        if (!$command) {
            return response()->json(['message' => 'Command not found or not authorized to delete.'], 404);
        }

        $command->glasses()->detach();
        $command->clients()->detach();

        if ($command->ordonnance) {
            Storage::delete($command->ordonnance);
        }

        $command->delete();

        return response()->json(['message' => 'Command deleted successfully.']);
    }

    public function updateStatus(Request $request, $id)
    {

        $validatedData = $request->validate([
            'status' => 'required|string|in:Pending,Done',
        ]);

        $command = Command::findOrFail($id);
        $command->status = $validatedData['status'];
        $command->save();

        return response()->json([
            'message' => 'Command status updated successfully!',
            'command' => $command,
        ]);
    }

    public function checkClient(Request $request)
    {
        $client = Client::where('nom', $request->nom)
            ->where('prenom', $request->prenom)
            ->where('telephone', $request->telephone)
            ->first();

        if ($client) {
            return response()->json(['client_id' => $client->id]);
        }
        return response()->json(['client_id' => null]);
    }
}
