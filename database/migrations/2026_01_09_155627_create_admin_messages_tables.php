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
        Schema::create('admin_messages', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('message'); // Short text
            $table->string('link')->nullable(); // External or internal link
            $table->timestamps();
        });

        Schema::create('admin_message_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('admin_message_id')->constrained()->onDelete('cascade');
            $table->timestamp('read_at')->useCurrent();
            
            // Ensure unique reading (a user reads a message only once)
            $table->unique(['user_id', 'admin_message_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin_message_user');
        Schema::dropIfExists('admin_messages');
    }
};
