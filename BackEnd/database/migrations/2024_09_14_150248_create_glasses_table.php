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
            $table->foreignId('type_verre_id')->nullable()->constrained('type_verres'); //nullable type_verre_id
            $table->string('nature_de_glasse')->nullable();
            $table->string('vision')->nullable();

            // OG fields
            $table->decimal('og_sph', 5, 2)->nullable();
            $table->decimal('og_cyl', 5, 2)->nullable();
            $table->integer('og_axe')->nullable();
            $table->decimal('og_addition', 5, 2)->nullable();

            // OD fields
            $table->decimal('od_sph', 5, 2)->nullable();
            $table->decimal('od_cyl', 5, 2)->nullable();
            $table->integer('od_axe')->nullable();
            $table->decimal('od_addition', 5, 2)->nullable();

            $table->foreignId('fournisseur_id')->nullable()->constrained('fournisseurs'); //nullable fournisseur_id
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
