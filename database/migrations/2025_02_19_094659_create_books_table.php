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
        Schema::create('books', function (Blueprint $table) {
            $table->string('isbn')->primary();
            $table->string('title');
            $table->string('author');
            $table->string('publisher_name');
            $table->string('sales_date');
            $table->string('image_url');
            $table->timestamps();
        });

        Schema::table('books', function (Blueprint $table) {
            $table->index('isbn');
            $table->index('updated_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
