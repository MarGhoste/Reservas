<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Disponibilidad extends Model
{
    use HasFactory;

    protected $table = 'disponibilidad'; // Nombre de tabla de la migración

    protected $fillable = [
        'barbero_id',
        'fecha',
        'motivo',
    ];

    // Casteo de atributos
    protected $casts = [
        'fecha' => 'date', // Asegura que la fecha se maneje como objeto Date
    ];
    
    // RELACIONES:

    /**
     * Obtiene al barbero al que se aplica esta excepción de disponibilidad.
     */
    public function barbero(): BelongsTo
    {
        return $this->belongsTo(User::class, 'barbero_id');
    }
}
