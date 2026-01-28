<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Models\Client;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Client::query();

        if ($request->has('search')) {
            $query->search($request->search);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $clients = $query->with('invoices')
                        ->orderBy('created_at', 'desc')
                        ->paginate(15);

        return Inertia::render('clients/index', [
            'clients' => $clients,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('clients/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreClientRequest $request)
    {
        Client::create($request->validated());

        return redirect()->route('clients.index')
                        ->with('success', 'Client created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Client $client)
    {
        $client->load(['invoices' => function ($query) {
            $query->orderBy('created_at', 'desc');
        }]);

        return Inertia::render('clients/show', [
            'client' => $client,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Client $client)
    {
        return Inertia::render('clients/edit', [
            'client' => $client,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClientRequest $request, Client $client)
    {
        $client->update($request->validated());

        return redirect()->route('clients.show', $client)
                        ->with('success', 'Client updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Client $client)
    {
        // Check if client has invoices
        if ($client->invoices()->count() > 0) {
            return back()->with('error', 'Cannot delete client with existing invoices.');
        }

        $client->delete();

        return redirect()->route('clients.index')
                        ->with('success', 'Client deleted successfully.');
    }

    /**
     * Get clients for API calls (for dropdowns, etc.)
     */
    public function api(Request $request)
    {
        $query = Client::active();

        if ($request->has('search')) {
            $query->search($request->search);
        }

        return $query->select('id', 'name', 'company_name', 'phone', 'email')
                    ->limit(20)
                    ->get();
    }

    /**
     * API endpoint for client suggestions
     */
    public function search(Request $request)
    {
        $search = $request->get('search', '');
        
        $clients = Client::active()
            ->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('company_name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('phone', 'like', "%{$search}%");
            })
            ->limit(10)
            ->get(['id', 'name', 'phone', 'address', 'client_vat_number', 'email', 'company_name']);
            
        return response()->json($clients);
    }
}
