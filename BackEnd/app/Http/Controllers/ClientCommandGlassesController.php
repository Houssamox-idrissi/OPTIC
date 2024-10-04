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
            'nom' => 'required_if:client_id,null|string',
            'prenom' => 'required_if:client_id,null|string',
            'telephone' => 'required_if:client_id,null|string',
            'assurance' => 'required_if:client_id,null|string',
            'client_id' => 'nullable|exists:clients,id',
            'date' => 'required|date',
            'medecin' => 'required|string',
            'prix' => 'required|numeric',
            'avance' => 'required|numeric',
            'notes' => 'nullable|string',
            'remise' => 'required|numeric',
            'reste' => 'required|numeric',
            'ordonnance' => 'nullable|file',
            'type_verre_id' => 'required|exists:type_verres,id',
            'nature_de_glasse' => 'required|string',
            'vision' => 'required|string',
            'og_sph' => 'required|numeric',
            'og_cyl' => 'required|numeric',
            'og_axe' => 'required|numeric',
            'og_addition' => 'required|numeric',
            'od_sph' => 'required|numeric',
            'od_cyl' => 'required|numeric',
            'od_axe' => 'required|numeric',
            'od_addition' => 'required|numeric',
            'fournisseur_id' => 'required|exists:fournisseurs,id'
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
            'date' => $validatedData['date'],
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
            'nom' => 'string',
            'prenom' => 'string',
            'telephone' => 'string',
            'assurance' => 'string',
            'date' => 'date',
            'medecin' => 'string',
            'prix' => 'numeric',
            'avance' => 'numeric',
            'notes' => 'nullable|string',
            'remise' => 'numeric',
            'reste' => 'numeric',
            'ordonnance' => 'nullable',
            'type_verre_id' => 'exists:type_verres,id',
            'nature_de_glasse' => 'string',
            'vision' => 'string',
            'og_sph' => 'numeric',
            'og_cyl' => 'numeric',
            'og_axe' => 'numeric',
            'og_addition' => 'numeric',
            'od_sph' => 'numeric',
            'od_cyl' => 'numeric',
            'od_axe' => 'numeric',
            'od_addition' => 'numeric',
            'fournisseur_id' => 'exists:fournisseurs,id'
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