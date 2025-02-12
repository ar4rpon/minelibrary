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
        Schema::create('share_links', function (Blueprint $table) {
            $table->integer('share_link_id')->primary();
            $table->string('share_link_url');
            $table->foreignId('book_list_id')->constrained()->onDelete('cascade');
            $table->timestamp('expiry_date');
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('share_links', function (Blueprint $table) {
            $table->dropForeign(['book_list_id']);
        });
        Schema::dropIfExists('share_links');
    }
};
