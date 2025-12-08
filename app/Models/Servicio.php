<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Servicio extends Model
{
    use HasFactory;

    // Campos que pueden ser asignados masivamente
    protected $fillable = [
        'nombre',
        'precio',
        'duracion_minutos',
        'activo',
    ];

    // Casteo de atributos
    protected $casts = [
        'precio' => 'decimal:2', // Asegura que el precio siempre sea un decimal con 2 dígitos
        'duracion_minutos' => 'integer',
        'activo' => 'boolean', // Asegura que 'activo' se maneje como booleano
    ];

    // RELACIONES:

    /**
     * Obtiene todas las reservas que utilizan este servicio.
     */
    public function reservas(): HasMany
    {
        return $this->hasMany(Reserva::class);
    }
}
