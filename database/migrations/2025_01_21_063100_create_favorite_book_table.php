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
            $table->id('favorite_id')->primary();
            $table->string('isbn');
            $table->string('user_id');
            $table->enum('read_status', ['unread', 'reading', 'completed']);
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

            $table->foreign('isbn')->references('isbn')->on('book');
            $table->foreign('user_id')->references('id')->on('users');
            $table->unique(['user_id', 'isbn']);

            $table->foreign('isbn')->references('isbn')->on('book')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('favorite_book', function (Blueprint $table) {
            $table->dropForeign(['isbn']);
            $table->dropForeign(['user_id']);
        });
        Schema::dropIfExists('favorite_book');
    }
};
