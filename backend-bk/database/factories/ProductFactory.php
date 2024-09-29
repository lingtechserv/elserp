<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition()
    {
        $category = $this->faker->numberBetween(1, 4);
        $subcat = match ($category) {
            1, 2 => $this->faker->numberBetween(1, 3),
            3, 4 => $this->faker->numberBetween(1, 4),
        };

        return [
            'name' => $this->faker->sentence(3),
            'category' => $category,
            'subcat' => $subcat,
            'description' => $this->faker->paragraph,

            'active' => $this->faker->boolean(90) // 90% chance to be true
        ];
    }
}