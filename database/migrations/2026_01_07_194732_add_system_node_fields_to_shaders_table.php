<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('shaders', function (Blueprint $table) {
            $table->enum('type', ['shader', 'system'])->default('shader')->after('name');
            $table->string('classname')->nullable()->after('type'); // E.g. "ArrayNode", "LfoNode"
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('shaders', function (Blueprint $table) {
            $table->dropColumn(['type', 'classname']);
        });
    }
};
