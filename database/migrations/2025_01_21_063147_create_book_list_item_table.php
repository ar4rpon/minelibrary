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
        Schema::create('book_list_item', function (Blueprint $table) {
            $table->integer('book_list_item_id')->primary();
            $table->integer('book_list_id')->constrained('book_list', 'book_list_id');
            $table->string('isbn')->constrained('book', 'isbn');
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('book_list_item');
    }
};
