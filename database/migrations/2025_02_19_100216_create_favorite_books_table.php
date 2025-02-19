<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\ReadStatus;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('favorite_books', function (Blueprint $table) {
            $table->id();
            $table->string('isbn');
            $table->enum('read_status', array_column(ReadStatus::cases(), 'value'))
                ->default(ReadStatus::WANTREAD->value);
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
        Schema::dropIfExists('favorite_books');
    }
};
