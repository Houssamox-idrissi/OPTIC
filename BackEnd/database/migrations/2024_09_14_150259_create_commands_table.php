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
        Schema::create('commands', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('medecin');
            $table->decimal('prix', 8, 2);
            $table->decimal('avance', 8, 2);
            $table->decimal('remise', 8, 2);
            $table->decimal('reste', 8, 2);
            $table->string('ordonnance');
            $table->string('status')->default('Pending');
            $table->string('notes');
            $table->unsignedBigInteger('admin_id')->nullable();
            $table->foreign('admin_id')->references('id')->on('admins')->onDelete('cascade');
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commands');
    }
};
