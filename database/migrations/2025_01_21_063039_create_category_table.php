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
        Schema::create('category', function (Blueprint $table) {
            $table->id('category_id');
            $table->string('category_name');
            $table->unsignedBigInteger('parent_category_id')->nullable();
            $table->timestamps();

            $table->foreign('parent_category_id')
                ->references('category_id')
                ->on('category')
                ->onDelete('set null');

            $table->unique('category_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('category', function (Blueprint $table) {
            $table->dropForeign(['parent_category_id']);
        });
        Schema::dropIfExists('category');
    }
};
