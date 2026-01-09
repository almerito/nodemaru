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
            $table->json('refuse_nodes')->nullable()->after('accept_params');
            $table->json('refuse_params')->nullable()->after('refuse_nodes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shaders', function (Blueprint $table) {
            $table->dropColumn(['refuse_nodes', 'refuse_params']);
        });
    }
};
