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
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->string('client_vat_number')->nullable();
            $table->string('email')->nullable();
            $table->string('company_name')->nullable();
            $table->string('contact_person')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->nullable()->default('Saudi Arabia');
            $table->string('postal_code')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->text('notes')->nullable();
            $table->timestamps();
            
            // Add indexes for better performance
            $table->index('name');
            $table->index('client_vat_number');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
