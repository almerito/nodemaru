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
        Schema::create('shaders', function (Blueprint $table) {
            $table->id();
            
            // Name and Label (assumed necessary)
            $table->string('name', 100);
            $table->string('label', 100);

            // Foreign Keys
            $table->foreignId('shader_category_id')->constrained('shader_categories')->onDelete('cascade');
            $table->foreignId('shader_subcategory_id')->nullable()->constrained('shader_subcategories')->onDelete('set null');
            $table->foreignId('shader_author_id')->nullable()->constrained('shader_authors')->onDelete('set null');

            // Booleans
            $table->boolean('has_input')->default(false);
            $table->boolean('has_output')->default(false);
            $table->boolean('has_param_input')->default(false);
            $table->boolean('has_param_output')->default(false);

            // JSON fields
            $table->json('accept_nodes')->nullable();
            $table->json('params')->nullable();
            $table->json('set_function')->nullable();

            // Status and Order
            $table->boolean('is_active')->default(true);
            $table->unsignedSmallInteger('order')->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shaders');
    }
};
