<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Invoice extends Model
{
    /** @use HasFactory<\Database\Factories\InvoiceFactory> */
    use HasFactory;

    protected $fillable = [
        'invoice_number',
        'invoice_type',
        'payment_type',
        'client_id',
        'client',
        'address',
        'phone',
        'service',
        'car_no',
        'car_type',
        'percent',
        'price',
        'vat',
        'total',
        'invoice_date',
        'client_vat_number',
        'note',
        'xml_data',
        'qr_code',
        'zatca_response',
    ];

    protected $casts = [
        'service' => 'array',
        'price' => 'decimal:2',
        'vat' => 'decimal:2',
        'total' => 'decimal:2',
        'invoice_date' => 'date',
    ];

    /**
     * Get the client that owns the invoice.
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    /**
     * Scope to get invoices for today.
     */
    public function scopeToday($query)
    {
        return $query->whereDate('created_at', today());
    }

    /**
     * Scope to get invoices for current month.
     */
    public function scopeThisMonth($query)
    {
        return $query->whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year);
    }

    /**
     * Scope to get pending invoices.
     */
    public function scopePending($query)
    {
        return $query->where('payment_type', '!=', 'paid')
                    ->orWhereNull('payment_type');
    }
}
