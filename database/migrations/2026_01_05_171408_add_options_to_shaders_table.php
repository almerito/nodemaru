<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('shaders', function (Blueprint $table) {
            $table->json('options')->nullable()->after('params');
            $table->json('accept_params')->nullable()->after('accept_nodes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shaders', function (Blueprint $table) {
            $table->dropColumn(['options', 'accept_params']);
        });
    }
};
