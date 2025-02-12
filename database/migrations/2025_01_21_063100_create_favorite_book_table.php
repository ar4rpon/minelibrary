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
        Schema::create('favorite_books', function (Blueprint $table) {
            $table->id('favorite_id')->primary();
            $table->foreignId('book_id')->constrained()->onDelete('cascade');
            $table->string('user_id');
            $table->enum('read_status', ['unread', 'reading', 'completed']);
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('favorite_books', function (Blueprint $table) {
            $table->dropForeign(['book_id']);
        });
        Schema::dropIfExists('favorite_books');
    }
};
