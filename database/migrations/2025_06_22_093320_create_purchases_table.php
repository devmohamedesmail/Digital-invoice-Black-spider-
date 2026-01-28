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
        Schema::create('purchases', function (Blueprint $table) {
            $table->id();
            $table->string('purchase_number')->unique();
            $table->string('supplier_name');
            $table->string('supplier_phone')->nullable();
            $table->string('supplier_email')->nullable();
            $table->text('supplier_address')->nullable();
            $table->string('supplier_vat_number')->nullable();
            $table->json('items'); // Store items as JSON array
            $table->decimal('subtotal', 10, 2);
            $table->decimal('vat_rate', 5, 2)->default(15);
            $table->decimal('vat_amount', 10, 2);
            $table->decimal('total', 10, 2);
            $table->date('purchase_date');
            $table->enum('status', ['pending', 'completed', 'cancelled'])->default('pending');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchases');
    }
};
