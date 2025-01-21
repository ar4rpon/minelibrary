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
        Schema::create('book_list', function (Blueprint $table) {
            $table->integer('book_list_id')->primary();
            $table->string('book_list_name');
            $table->string('description');
            $table->string('create_by_user_id')->constrained('users', 'id');
            $table->boolean('is_public');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('book_list');
    }
};
