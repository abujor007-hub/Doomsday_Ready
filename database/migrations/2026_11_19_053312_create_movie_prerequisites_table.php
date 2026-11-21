
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('movie_prerequisites', function (Blueprint $table) {

            $table->id();

            $table->foreignId('movie_id')->constrained('movies')->cascadeOnDelete();

            $table->foreignId('prerequisite_movie_id')->constrained('movies') ->cascadeOnDelete();

            $table->unique(['movie_id','prerequisite_movie_id']);

            $table->timestamps();

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('movie_prerequisites');
    }
};
