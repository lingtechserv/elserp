<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->engine = 'InnoDB'; // Ensure InnoDB engine
            $table->id(); // Creates an auto-incrementing primary key
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->morphs('item');
            $table->unsignedInteger('quantity');
            $table->timestamps();

        });
    }

    public function down()
    {
        Schema::dropIfExists('order_items');
    }
};
