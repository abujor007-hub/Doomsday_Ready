
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cinema_bundles', function (Blueprint $table) {

            $table->id();

            $table->foreignId('cinema_id')->constrained('cinemas')->cascadeOnDelete();

            $table->unsignedSmallInteger('bundle_size');

            $table->unique(['cinema_id','bundle_size']);

            $table->timestamps();

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cinema_bundles');
    }
};
