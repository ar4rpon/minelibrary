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
        Schema::create('favorite_book', function (Blueprint $table) {
            $table->integer('favorite_id')->primary();
            $table->string('isbn')->constrained('book', 'isbn');
            $table->string('user_id')->constrained('users', 'id');
            $table->enum('read_status', ['unread', 'reading', 'completed']);
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('favorite_book');
    }
};
