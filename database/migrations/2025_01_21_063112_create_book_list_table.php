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
        Schema::create('book_lists', function (Blueprint $table) {
            $table->id('book_list_id');
            $table->string('book_list_name');
            $table->text('description');
            $table->string('create_by_user_id');
            $table->boolean('is_public')->default(false);
            $table->timestamps();

            $table->foreign('create_by_user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

            $table->unique(['book_list_name', 'create_by_user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('book_lists', function (Blueprint $table) {
            $table->dropForeign(['create_by_user_id']);
        });
        Schema::dropIfExists('book_lists');
    }
};
