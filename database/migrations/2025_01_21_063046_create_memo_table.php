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
        Schema::create('memo', function (Blueprint $table) {
            $table->integer('memo_id')->primary();
            $table->string('isbn')->constrained('book', 'isbn');
            $table->string('user_id')->constrained('users', 'id');
            $table->string('memo');
            $table->integer('memo_chapter');
            $table->integer('memo_page');
            $table->boolean('is_public');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('memo');
    }
};
