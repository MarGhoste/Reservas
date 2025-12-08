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
        Schema::create('disponibilidad', function (Blueprint $table) {
            $table->id();
            $table->foreignId('barbero_id')->constrained('users')->onDelete('cascade');
            $table->date('fecha'); // Un barbero solo puede tener una excepción por día
            $table->string('motivo')->nullable();
            $table->timestamps();

            $table->unique(['barbero_id', 'fecha']);
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('disponibilidads');
    }
};
