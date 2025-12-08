<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('horario_barberos', function (Blueprint $table) {
            $table->id();

            $table->foreignId('barbero_id')->constrained('users')->onDelete('cascade');
            $table->tinyInteger('dia_semana')->unsigned();
            $table->time('hora_inicio');
            $table->time('hora_fin');

            // ¡ESTO ES LO CRUCIAL! Nombre de índice corto.
            $table->unique(
                ['barbero_id', 'dia_semana', 'hora_inicio', 'hora_fin'],
                'barbero_horario_unico'
            );

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('horario_barberos');
    }
};
