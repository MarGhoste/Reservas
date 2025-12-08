<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reserva extends Model
{
    use HasFactory;

    // Campos que pueden ser asignados masivamente
    protected $fillable = [
        'cliente_id',
        'barbero_id',
        'servicio_id',
        'fecha_inicio',
        'estado',
    ];

    // Casteo de atributos
    protected $casts = [
        'fecha_inicio' => 'datetime', // Asegura que se maneje como objeto DateTime
        'estado' => 'string',
    ];
    
    // RELACIONES:

    /**
     * Obtiene al usuario que creó la reserva (el Cliente).
     */
    public function cliente(): BelongsTo
    {
        return $this->belongsTo(User::class, 'cliente_id');
    }

    /**
     * Obtiene al barbero asignado a esta reserva.
     */
    public function barbero(): BelongsTo
    {
        return $this->belongsTo(User::class, 'barbero_id');
    }

    /**
     * Obtiene el servicio contratado para esta reserva.
     */
    public function servicio(): BelongsTo
    {
        return $this->belongsTo(Servicio::class, 'servicio_id');
    }
}
