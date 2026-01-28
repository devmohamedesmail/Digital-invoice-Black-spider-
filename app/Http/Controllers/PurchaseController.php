<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePurchaseRequest;
use App\Http\Requests\UpdatePurchaseRequest;
use App\Models\Purchase;
use Inertia\Inertia;
use Illuminate\Http\Request;

class PurchaseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $purchases = Purchase::orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('purchases/index', [
            'purchases' => $purchases,
            'stats' => [
                'total' => Purchase::count(),
                'pending' => Purchase::pending()->count(),
                'completed' => Purchase::completed()->count(),
                'cancelled' => Purchase::cancelled()->count(),
                'today' => Purchase::today()->count(),
                'this_month' => Purchase::thisMonth()->count(),
                'total_amount' => Purchase::sum('total'),
                'monthly_total' => Purchase::thisMonth()->sum('total'),
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('purchases/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            // Validate the request data
            $validated = $request->validate([
                'purchase_number' => 'nullable|string|max:255',
                'supplier_name' => 'required|string|max:255',
                'supplier_company' => 'nullable|string|max:255',
                'supplier_phone' => 'nullable|string|max:255',
                'supplier_email' => 'nullable|email|max:255',
                'supplier_address' => 'nullable|string',
                'items' => 'required', // Can be JSON string or array
                'subtotal' => 'required|numeric|min:0',
                'vat_rate' => 'required|numeric|min:0|max:100',
                'vat_amount' => 'required|numeric|min:0',
                'total' => 'required|numeric|min:0',
                'purchase_date' => 'required|date',
                'status' => 'required|in:pending,completed,cancelled',
                'notes' => 'nullable|string',
            ]);

            // Generate purchase number if not provided
            if (empty($validated['purchase_number'])) {
                $validated['purchase_number'] = 'PO-' . date('Y') . '-' . str_pad(Purchase::count() + 1, 6, '0', STR_PAD_LEFT);
            }

            // Handle items - can be JSON string or array
            if (is_string($validated['items'])) {
                // If it's a string, decode it
                $items = json_decode($validated['items'], true);
                if (json_last_error() !== JSON_ERROR_NONE) {
                    return back()->withErrors(['items' => 'Invalid items format'])->withInput();
                }
            } else {
                // If it's already an array, use it directly
                $items = $validated['items'];
            }

            // Ensure items array is not empty
            if (empty($items) || !is_array($items)) {
                return back()->withErrors(['items' => 'At least one item is required'])->withInput();
            }

            // Convert items back to array for storage (model will cast to JSON)
            $validated['items'] = $items;

            // Create the purchase
            $purchase = Purchase::create($validated);

            return redirect()->back();

        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            \Log::error('Purchase creation error: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to create purchase: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Purchase $purchase)
    {        
        return Inertia::render('purchases/show', [
            'purchase' => $purchase
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Purchase $purchase)
    {
        return Inertia::render('purchases/edit', [
            'purchase' => $purchase
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePurchaseRequest $request, Purchase $purchase)
    {
        $purchase->update($request->validated());

        return redirect()->route('purchases.show', $purchase)
            ->with('success', 'Purchase updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Purchase $purchase)
    {
        $purchase->delete();

        return redirect()->route('purchases.index')
            ->with('success', 'Purchase deleted successfully!');
    }

    /**
     * API endpoint for purchases data
     */
    public function api()
    {
        $purchases = Purchase::orderBy('created_at', 'desc')
            ->get();

        return response()->json($purchases);
    }

    /**
     * Search purchases
     */
    public function search(Request $request)
    {
        $query = $request->get('q');
        
        $purchases = Purchase::where('purchase_number', 'LIKE', "%{$query}%")
            ->orWhere('supplier_name', 'LIKE', "%{$query}%")
            ->orWhere('supplier_company', 'LIKE', "%{$query}%")
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return response()->json($purchases);
    }
}
