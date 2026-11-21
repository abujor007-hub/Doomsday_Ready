<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Movie;
use App\Services\MovieService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class MovieController extends Controller
{


    public function index()
    {
        $movies = Movie::with('prerequisites')
            ->orderBy('id')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Movies retrieved successfully.',
            'data' => $movies
        ], 200);
    }



    public function store(
        Request $request,
        MovieService $movieService
    ) {

        $validated = $request->validate([

            'title' => [
                'required',
                'string',
                'max:255',
                'unique:movies,title'
            ],

            'release_year' => [
                'required',
                'integer',
                'min:1888',
                'max:2100'
            ],

            'runtime' => [
                'required',
                'integer',
                'min:1',
                'max:300'
            ],

            'watched' => [
                'sometimes',
                'boolean'
            ],

            'prerequisites' => [
                'sometimes',
                'array'
            ],

            'prerequisites.*' => [
                'integer',
                'distinct',
                'exists:movies,id'
            ]

        ]);

        $prerequisiteIds = $validated['prerequisites'] ?? [];

        $movie = DB::transaction(function () use (
            $validated,
            $prerequisiteIds,
            $movieService
        ) {

          
            $movie = Movie::create([

                'title' => $validated['title'],

                'release_year' => $validated['release_year'],

                'runtime' => $validated['runtime'],

                'watched' => $validated['watched'] ?? false,

            ]);

          
            $movieService->validatePrerequisites(
                $movie->id,
                $prerequisiteIds
            );

     
            $movie->prerequisites()->sync($prerequisiteIds);

            return $movie;

        });

        return response()->json([
            'success' => true,
            'message' => 'Movie created successfully.',
            'data' => $movie->load('prerequisites')
        ], 201);
    }



    public function update(
        Request $request,
        string $id,
        MovieService $movieService
    ) {


        $movie = Movie::findOrFail($id);

        $validated = $request->validate([

            'title' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('movies', 'title')
                    ->ignore($movie->id)
            ],

            'release_year' => [
                'sometimes',
                'required',
                'integer',
                'min:1888',
                'max:2100'
            ],

            'runtime' => [
                'sometimes',
                'required',
                'integer',
                'min:1',
                'max:300'
            ],

            'watched' => [
                'sometimes',
                'boolean'
            ],

            'prerequisites' => [
                'sometimes',
                'array'
            ],

            'prerequisites.*' => [
                'integer',
                'distinct',
                'exists:movies,id'
            ]

        ]);

        $updatedMovie = DB::transaction(function () use (
            $movie,
            $validated,
            $movieService
        ) {


            if (array_key_exists('prerequisites', $validated)) {

                $prerequisiteIds = $validated['prerequisites'];

      
                $movieService->validatePrerequisites(
                    $movie->id,
                    $prerequisiteIds
                );

            
                $movie->prerequisites()->sync($prerequisiteIds);

                unset($validated['prerequisites']);
            }

     
            $movie->update($validated);

            return $movie;

        });

        return response()->json([
            'success' => true,
            'message' => 'Movie updated successfully.',
            'data' => $updatedMovie->load('prerequisites')
        ], 200);
    }



    public function rewatchOrder(
        string $id,
        MovieService $movieService
    ) {

        $movie = Movie::findOrFail($id);

   
        $result = $movieService->getRewatchOrder($movie);

        return response()->json([

            'success' => true,

            'target_movie' => $movie->title,

            'total_movies' => count($result['movies']),

            'watched_count' => $result['watched_count'],

            'unwatched_count' => $result['unwatched_count'],

            'remaining_runtime' => $result['remaining_runtime'],

            'data' => $result['movies']

        ], 200);
    }
}
