<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInvoiceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'price' => 'required',
            'note' => 'required',
            'percent' => 'required',
            'invoice_type' => 'required',
            'payment_type' => 'required',
            'service' => 'required',
        ];
    }





    public function messages(): array
    {
        return [
            'price.required' => 'السعر مطلوب',
            'note.required' => 'الملاحظات مطلوبة',
            'percent.required' => 'النسبة مطلوبة',
            'invoice_type.required' => 'نوع الفاتورة مطلوب',
            'payment_type.required' => 'نوع الدفع مطلوب',
            'service.required' => 'الخدمة مطلوبة',
        ];
    }





}
