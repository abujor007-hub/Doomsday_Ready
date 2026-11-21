<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cinema;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class CinemaController extends Controller
{
   
    public function index()
    {
        $cinemas = Cinema::with('bundles')->orderBy('id')->get();

        return response()->json([
            'success' => true,
            'message' => 'Cinemas retrieved successfully.',
            'data' => $cinemas
        ], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                'unique:cinemas,name'
            ],

            'bundle_sizes' => [
                'required',
                'array',
                'min:1',
                'max:10'
            ],

            'bundle_sizes.*' => [
                'required',
                'integer',
                'min:1',
                'max:500',
                'distinct'
            ],
        ]);

        $cinema = DB::transaction(function () use ($validated) {

            $cinema = Cinema::create([
                'name' => $validated['name']
            ]);

            foreach ($validated['bundle_sizes'] as $size) {
                $cinema->bundles()->create([
                    'bundle_size' => $size
                ]);
            }

            return $cinema;
        });

        return response()->json([
            'success' => true,
            'message' => 'Cinema created successfully.',
            'data' => $cinema->load('bundles')
        ], 201);
    }


    public function calculate(Request $request, string $id)
    {
        $validated = $request->validate([
            'group_size' => [
                'required',
                'integer',
                'min:1',
                'max:10000'
            ],
        ]);

        $cinema = Cinema::with('bundles')->findOrFail($id);

   $groupSize = (int) $validated['group_size'];

        $bundleSizes = $cinema->bundles
            ->pluck('bundle_size')
            ->map(fn ($size) => (int) $size)
            ->sort()
            ->values()
            ->all();

        $dp = array_fill(0, $groupSize + 1, PHP_INT_MAX);

        $usedBundle = array_fill(0, $groupSize + 1, 0);

        $dp[0] = 0;

    
        for ($i = 1; $i <= $groupSize; $i++) {

            foreach ($bundleSizes as $bundleSize) {

                if ($bundleSize > $i) {
                    break;
                }

                if ($dp[$i - $bundleSize] !== PHP_INT_MAX) {

                    $newCount = $dp[$i - $bundleSize] + 1;

                    if ($newCount < $dp[$i]) {
                        $dp[$i] = $newCount;
                        $usedBundle[$i] = $bundleSize;
                    }
                }
            }
        }


        if ($dp[$groupSize] === PHP_INT_MAX) {

            return response()->json([
                'success' => true,
                'possible' => false,
                'message' => 'No exact bundle combination is possible.'
            ], 200);
        }

  
        $bundleCounts = [];

        $remaining = $groupSize;

        while ($remaining > 0) {

            $bundleSize = $usedBundle[$remaining];

            $bundleCounts[$bundleSize] =
                ($bundleCounts[$bundleSize] ?? 0) + 1;

            $remaining -= $bundleSize;
        }

        ksort($bundleCounts);

        $result = [];

        foreach ($bundleCounts as $size => $count) {
            $result[] = [
                'bundle_size' => (int) $size,
                'count' => $count
            ];
        }

        return response()->json([
            'success' => true,
            'possible' => true,
            'cinema' => $cinema->name,
            'group_size' => $groupSize,
            'minimum_bundles' => $dp[$groupSize],
            'bundle_counts' => $result
        ], 200);
    }



    public function booking(Request $request, string $id)
    {
   
        $request->merge([
            'group_size' => $request->query('groupSize')
        ]);


        return $this->calculate($request, $id);
    }

}
