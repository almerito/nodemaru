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
        Schema::create('shader_subcategories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shader_category_id')->constrained('shader_categories')->onDelete('cascade');
            $table->string('name', 100);
            $table->string('label', 100);
            $table->unsignedSmallInteger('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            // Unicità della coppia shader_category_id + name
            $table->unique(['shader_category_id', 'name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shader_subcategories');
    }
};
