<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePurchaseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $purchaseId = $this->route('purchase')->id ?? null;
        
        return [
            'purchase_number' => 'required|string|max:255|unique:purchases,purchase_number,' . $purchaseId,
            'supplier_name' => 'required|string|max:255',
            'supplier_company' => 'nullable|string|max:255',
            'supplier_phone' => 'nullable|string|max:255',
            'supplier_email' => 'nullable|email|max:255',
            'supplier_address' => 'nullable|string',
            'items' => 'required|json',
            'subtotal' => 'required|numeric|min:0',
            'vat_rate' => 'required|numeric|min:0|max:100',
            'vat' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'purchase_date' => 'required|date',
            'status' => 'required|in:pending,completed,cancelled',
            'notes' => 'nullable|string',
        ];
    }

    /**
     * Get custom attribute names for validation errors.
     */
    public function attributes(): array
    {
        return [
            'purchase_number' => 'purchase order number',
            'supplier_name' => 'supplier name',
            'supplier_company' => 'supplier company',
            'supplier_phone' => 'supplier phone',
            'supplier_email' => 'supplier email',
            'supplier_address' => 'supplier address',
            'purchase_date' => 'purchase date',
            'vat_rate' => 'VAT rate',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Convert string values to appropriate types
        if ($this->has('subtotal')) {
            $this->merge(['subtotal' => (float) $this->subtotal]);
        }
        if ($this->has('vat_rate')) {
            $this->merge(['vat_rate' => (float) $this->vat_rate]);
        }
        if ($this->has('vat')) {
            $this->merge(['vat' => (float) $this->vat]);
        }
        if ($this->has('total')) {
            $this->merge(['total' => (float) $this->total]);
        }
    }
}
