<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends Model
{
    /** @use HasFactory<\Database\Factories\ClientFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'address',
        'client_vat_number',
        'email',
        'company_name',
        'contact_person',
        'city',
        'country',
        'postal_code',
        'status',
        'notes',
    ];

    protected $casts = [
        'status' => 'string',
    ];

    /**
     * Get all invoices for this client.
     */
    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    /**
     * Get the full address as a formatted string.
     */
    public function getFullAddressAttribute(): string
    {
        $address = $this->address;
        if ($this->city) {
            $address .= ', ' . $this->city;
        }
        if ($this->country) {
            $address .= ', ' . $this->country;
        }
        if ($this->postal_code) {
            $address .= ' ' . $this->postal_code;
        }
        return $address;
    }

    /**
     * Scope to get only active clients.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope to search clients by name or company.
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('company_name', 'like', "%{$search}%")
              ->orWhere('email', 'like', "%{$search}%");
        });
    }
}
