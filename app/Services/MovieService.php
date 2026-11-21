<?php

namespace App\Services;

use App\Models\Movie;
use Illuminate\Http\Exceptions\HttpResponseException;

class MovieService
{
    public function validatePrerequisites(
        int $movieId,
        array $prerequisiteIds
    ): void {

        if (in_array($movieId, $prerequisiteIds)) {
            $this->circularError();
        }

        foreach ($prerequisiteIds as $prerequisiteId) {

            $visited = [];

            if ($this->hasPath(
                (int) $prerequisiteId,
                $movieId,
                $visited
            )) {
                $this->circularError();
            }
        }
    }

    private function hasPath(
        int $currentId,
        int $targetId,
        array &$visited
    ): bool {

        if ($currentId === $targetId) {
            return true;
        }

        if (isset($visited[$currentId])) {
            return false;
        }

        $visited[$currentId] = true;

        $movie = Movie::findOrFail($currentId);

        $prerequisites = $movie->prerequisites()
            ->pluck('movies.id');

        foreach ($prerequisites as $prerequisiteId) {

            if ($this->hasPath(
                (int) $prerequisiteId,
                $targetId,
                $visited
            )) {
                return true;
            }
        }

        return false;
    }

    private function circularError(): never
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'error' => 'CIRCULAR_DEPENDENCY',
                'message' => 'Circular movie dependency is not allowed.'
            ], 409)
        );
    }

    public function getRewatchOrder(Movie $targetMovie): array
    {
        $visited = [];
        $orderedMovies = [];

        $this->collectPrerequisites(
            $targetMovie,
            $visited,
            $orderedMovies
        );

        $watchedCount = 0;
        $unwatchedCount = 0;
        $remainingRuntime = 0;

        foreach ($orderedMovies as $movie) {

            if ($movie['watched'] === true) {
                $watchedCount++;
            } else {
                $unwatchedCount++;
                $remainingRuntime += $movie['runtime'];
            }
        }

        return [
            'movies' => $orderedMovies,
            'watched_count' => $watchedCount,
            'unwatched_count' => $unwatchedCount,
            'remaining_runtime' => $remainingRuntime,
        ];
    }

    private function collectPrerequisites(
        Movie $movie,
        array &$visited,
        array &$orderedMovies
    ): void {

        $prerequisites = $movie->prerequisites()
            ->orderBy('movies.id')
            ->get();

        foreach ($prerequisites as $prerequisite) {

            if (isset($visited[$prerequisite->id])) {
                continue;
            }

            $visited[$prerequisite->id] = true;

            $this->collectPrerequisites(
                $prerequisite,
                $visited,
                $orderedMovies
            );

            $orderedMovies[] = [
                'id' => $prerequisite->id,
                'title' => $prerequisite->title,
                'release_year' => $prerequisite->release_year,
                'runtime' => $prerequisite->runtime,
                'watched' => $prerequisite->watched,
            ];
        }
    }
}
