<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number');
            $table->string('invoice_type')->nullable();
            $table->string('payment_type')->nullable();
            $table->string('client')->nullable();
            $table->string('address')->nullable();
            $table->string('phone')->nullable();
            $table->json('service')->nullable();
            $table->string('car_no')->nullable();
            $table->string('car_type')->nullable();
            $table->string('percent')->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('vat', 10, 2);
            $table->decimal('total', 10, 2);
            $table->string('invoice_date')->nullable();
            $table->longText('client_vat_number')->nullable();
            $table->longText('note')->nullable();
            $table->text('xml_data')->nullable(); 
            $table->text('qr_code')->nullable();
            $table->text('zatca_response')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
