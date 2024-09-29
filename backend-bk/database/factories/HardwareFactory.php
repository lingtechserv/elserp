<?php

namespace Database\Factories;

use App\Models\Hardware;
use Illuminate\Database\Eloquent\Factories\Factory;

class HardwareFactory extends Factory
{
    protected $model = Hardware::class;

    public function definition()
    {
        $category = $this->faker->numberBetween(1, 3);
        $subcat = match ($category) {
            1 => $this->faker->numberBetween(1, 4),
            2 => $this->faker->numberBetween(1, 7),
            3 => $this->faker->numberBetween(1, 3),
        };

        return [
            'sku' => $this->faker->unique()->numerify('HW####'),
            'category' => $category,
            'subcat' => $subcat,
            'name' => $this->faker->sentence(3),
            'pack_size' => $this->faker->randomElement(['Small', 'Medium', 'Large']),
            'description' => $this->faker->paragraph,
            'active' => $this->faker->boolean(90) // 90% chance to be true
        ];
    }
}