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
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->longText('shop_name')->nullable();
            $table->longText('name')->nullable();
            $table->longText('logo')->nullable();
            $table->longText('phone')->nullable();
            $table->longText('address')->nullable();
            $table->longText('email')->nullable();
            $table->longText('vat_number')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
