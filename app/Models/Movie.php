<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Movie extends Model
{
    protected $fillable = [
        'title',
        'release_year',
        'runtime',
        'watched',
    ];

    protected function casts(): array
    {
        return [
            'watched' => 'boolean',
            'release_year' => 'integer',
            'runtime' => 'integer',
        ];
    }

    // Movies that must be watched first
    public function prerequisites(): BelongsToMany
    {
        return $this->belongsToMany(
            Movie::class,
            'movie_prerequisites',
            'movie_id',
            'prerequisite_movie_id'
        )->withTimestamps();
    }

    // Movies that depend on this movie
    public function dependents(): BelongsToMany
    {
        return $this->belongsToMany(
            Movie::class,
            'movie_prerequisites',
            'prerequisite_movie_id',
            'movie_id'
        )->withTimestamps();
    }
}
