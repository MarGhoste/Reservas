<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HorarioBarbero extends Model
{
    use HasFactory;

    protected $fillable = [
        'barbero_id',
        'dias_semana',
        'hora_inicio',
        'hora_fin',
    ];

    // Casteo de atributos
    protected $casts = [
        // Convertimos el día de la semana a entero (1=Lunes)
        'dias_semana' => 'array',
        // Aunque son campos TIME en DB, es útil manejarlos como strings o usar Carbon/DateTime
        'hora_inicio' => 'string',
        'hora_fin' => 'string',
    ];
    
    // RELACIONES:

    /**
     * Obtiene al barbero al que pertenece este patrón de horario.
     */
    public function barbero(): BelongsTo
    {
        return $this->belongsTo(User::class, 'barbero_id');
    }
}
