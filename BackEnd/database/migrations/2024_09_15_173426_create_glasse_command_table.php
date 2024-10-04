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
        Schema::create('glasse_command', function (Blueprint $table) {
            $table->id();
            $table->foreignId('command_id')->constrained('commands')->onDelete('cascade');
            $table->foreignId('glasse_id')->constrained('glasses')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('glasse_command');
    }
};
