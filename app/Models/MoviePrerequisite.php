<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MoviePrerequisite extends Model
{
    protected $fillable = [
        'movie_id',
        'prerequisite_movie_id',
    ];

    public function movie(): BelongsTo
    {
        return $this->belongsTo(Movie::class);
    }

    public function prerequisiteMovie(): BelongsTo
    {
        return $this->belongsTo(
            Movie::class,
            'prerequisite_movie_id'
        );
    }
}
