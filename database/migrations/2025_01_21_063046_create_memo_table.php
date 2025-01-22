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
        Schema::create('memos', function (Blueprint $table) {
            $table->id('memo_id');
            $table->string('isbn');
            $table->string('user_id');
            $table->text('memo');
            $table->unsignedInteger('memo_chapter');
            $table->unsignedInteger('memo_page');
            $table->boolean('is_public')->default(false);
            $table->timestamps();

            $table->foreign('isbn')->references('isbn')->on('books')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            $table->index(['user_id', 'isbn']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('memos', function (Blueprint $table) {
            $table->dropForeign(['isbn']);
            $table->dropForeign(['user_id']);
        });
        Schema::dropIfExists('memos');
    }
};
