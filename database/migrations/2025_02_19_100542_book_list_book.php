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
        Schema::create('book_shelf_book', function (Blueprint $table) {
            $table->id();
            $table->foreignId('book_shelf_id')
                ->constrained()
                ->onDelete('cascade');
            $table->string('isbn');
            $table->timestamps();

            $table->foreign('isbn')
                ->references('isbn')
                ->on('books')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('book_shelf_book');
    }
};
