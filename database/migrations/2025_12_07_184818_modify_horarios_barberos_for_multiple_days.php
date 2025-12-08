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


        Schema::table('horario_barberos', function (Blueprint $table) {

            // PASO 1: Creamos un nuevo índice simple para 'barbero_id'. 
            // MySQL transferirá la FK para que use este nuevo índice.
            $table->index('barbero_id');


            // PASO 2: Ahora podemos eliminar el índice único compuesto sin error.
            $table->dropUnique('barbero_horario_unico');

            // PASO 3: Ejecutamos el resto de tus cambios originales.
            $table->dropColumn('dia_semana');
            $table->json('dias_semana')->after('barbero_id');
            $table->unique(['barbero_id', 'hora_inicio', 'hora_fin']);

            // PASO 4 (Opcional pero recomendado): Eliminamos el índice simple que creamos,
            // ya que la clave foránea ahora puede usar el nuevo índice único que empieza por 'barbero_id'.
            // Laravel lo nombrará 'horario_barberos_barbero_id_index'.
            $table->dropIndex('horario_barberos_barbero_id_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('horario_barberos', function (Blueprint $table) {
            $table->dropUnique(['barbero_id', 'hora_inicio', 'hora_fin']);
            $table->dropColumn('dias_semana');
            $table->tinyInteger('dia_semana')->unsigned()->after('barbero_id');
            $table->unique(
                ['barbero_id', 'dia_semana', 'hora_inicio', 'hora_fin'],
                'barbero_horario_unico'
            );
        });
    }
};
