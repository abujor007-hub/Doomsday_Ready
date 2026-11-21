<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CinemaBundle extends Model
{
    protected $fillable = [
        'cinema_id',
        'bundle_size',
    ];

    protected function casts(): array
    {
        return [
            'bundle_size' => 'integer',
        ];
    }

    public function cinema(): BelongsTo
    {
        return $this->belongsTo(Cinema::class);
    }
}
