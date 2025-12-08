<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservas', function (Blueprint $table) {
            $table->id();

            // Claves Foráneas
            $table->foreignId('cliente_id')->constrained('users'); // El cliente es un User
            $table->foreignId('barbero_id')->constrained('users'); // El barbero es otro User
            $table->foreignId('servicio_id')->constrained('servicios'); // El servicio contratado

            // Campos de la Reserva
            $table->dateTime('fecha_inicio'); // Inicio de la cita
            // El estado de la cita
            $table->enum('estado', ['pendiente', 'confirmada', 'cancelada', 'realizada'])->default('pendiente');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservas');
    }
};
