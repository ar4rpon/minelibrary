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
        Schema::create('book_list_items', function (Blueprint $table) {
            $table->id('book_list_item_id');
            $table->unsignedBigInteger('book_list_id');
            $table->string('isbn');
            $table->timestamps();

            $table->foreign('book_list_id')
                ->references('book_list_id')
                ->on('book_lists')
                ->onDelete('cascade');
            $table->foreign('isbn')
                ->references('isbn')
                ->on('books')
                ->onDelete('cascade');

            $table->unique(['book_list_id', 'isbn']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('book_list_items', function (Blueprint $table) {
            $table->dropForeign(['book_list_id']);
            $table->dropForeign(['isbn']);
        });
        Schema::dropIfExists('book_list_items');
    }
};
