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
        Schema::create('glasses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('type_verre_id')->constrained('type_verres'); //blue..
            $table->string('nature_de_glasse');
            $table->string('vision');
            // OG
            $table->decimal('og_sph', 5, 2);
            $table->decimal('og_cyl', 5, 2);
            $table->integer('og_axe');
            $table->decimal('og_addition', 5, 2)->nullable();
            // OD
            $table->decimal('od_sph', 5, 2);
            $table->decimal('od_cyl', 5, 2);
            $table->integer('od_axe');
            $table->decimal('od_addition', 5, 2)->nullable();
            $table->foreignId('fournisseur_id')->constrained('fournisseurs');
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
        Schema::dropIfExists('glasses');
    }
};
