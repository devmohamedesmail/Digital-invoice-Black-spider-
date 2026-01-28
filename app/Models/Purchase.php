<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    /** @use HasFactory<\Database\Factories\PurchaseFactory> */
    use HasFactory;

    protected $fillable = [
        'purchase_number',
        'supplier_name',
        'supplier_company',
        'supplier_phone',
        'supplier_email',
        'supplier_address',
        'supplier_vat_number',
        'items',
        'subtotal',
        'vat_rate',
        'vat_amount',
        'total',
        'purchase_date',
        'status',
        'notes',
    ];

    protected $casts = [
        'items' => 'array',
        'subtotal' => 'decimal:2',
        'vat_rate' => 'decimal:2',
        'vat_amount' => 'decimal:2',
        'total' => 'decimal:2',
        'purchase_date' => 'date',
    ];

    public function scopeToday($query)
    {
        return $query->whereDate('purchase_date', today());
    }

    public function scopeThisMonth($query)
    {
        return $query->whereMonth('purchase_date', now()->month)
                    ->whereYear('purchase_date', now()->year);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeCancelled($query)
    {
        return $query->where('status', 'cancelled');
    }
}
