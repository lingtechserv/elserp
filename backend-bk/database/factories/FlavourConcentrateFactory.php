<?php

namespace Database\Factories;

use App\Models\FlavourConcentrate;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class FlavourConcentrateFactory extends Factory
{
    protected $model = FlavourConcentrate::class;

    public function definition()
    {
        return [
            'name' => $this->faker->sentence(3),
            'sku' => $this->faker->unique()->numerify('FC####'),
            'rmc_product' => $this->faker->word,
            'description' => $this->faker->paragraph,
            'active' => $this->faker->boolean(90) // 90% chance to be true
        ];
    }
}
