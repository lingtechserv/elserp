<?php

namespace Database\Factories;

use App\Models\BulkELiquid;
use Illuminate\Database\Eloquent\Factories\Factory;

class BulkELiquidFactory extends Factory
{
    protected $model = BulkELiquid::class;

    public function definition()
    {
        return [
            'sku' => $this->faker->unique()->numerify('BLK####'),
            'name' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph,
            'rmc_product' => $this->faker->word,
            'active' => $this->faker->boolean(90) 
        ];
    }
}
