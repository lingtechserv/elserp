<?php

namespace Database\Factories;

use App\Models\InventoryLocation;
use Illuminate\Database\Eloquent\Factories\Factory;

class InventoryLocationFactory extends Factory
{
    protected $model = InventoryLocation::class;

    public function definition()
    {
        return [
            // Default attributes
            'name' => $this->faker->word,
            'type' => $this->faker->randomElement(['Warehouse', 'System', 'Vendor', 'Retail']),
            'description' => $this->faker->sentence,
        ];
    }

    public function warehouse()
    {
        return $this->state(function (array $attributes) {
            return [
                'name' => 'Warehouse - ' . $this->faker->word,
                'type' => 'Warehouse',
                'description' => $this->faker->sentence,
            ];
        });
    }

    public function system()
    {
        return $this->state(function (array $attributes) {
            return [
                'name' => 'Production',
                'type' => 'System',
                'description' => $this->faker->sentence,
            ];
        });
    }

    public function vendor()
    {
        return $this->state(function (array $attributes) {
            return [
                'name' => 'Vendor - ' . $this->faker->word,
                'type' => 'Vendor',
                'description' => $this->faker->sentence,
            ];
        });
    }

    public function retail()
    {
        return $this->state(function (array $attributes) {
            return [
                'name' => 'Retail - ' . $this->faker->word,
                'type' => 'Retail',
                'description' => $this->faker->sentence,
            ];
        });
    }

    public function section()
    {
        return $this->state(function (array $attributes) {
            return [
                'name' => 'Section - ' . $this->faker->word,
                'type' => 'Section',
                // No description for sections and below
            ];
        });
    }

    public function row()
    {
        return $this->state(function (array $attributes) {
            return [
                'name' => 'Row ' . $this->faker->numberBetween(1, 10),
                'type' => 'Row',
            ];
        });
    }

    public function shelf()
    {
        return $this->state(function (array $attributes) {
            $alphabet = range('A', 'Z');
            return [
                'name' => 'Shelf ' . $alphabet[$this->faker->numberBetween(0, 7)],
                'type' => 'Shelf',
            ];
        });
    }

    public function bin()
    {
        return $this->state(function (array $attributes) {
            return [
                'name' => 'Bin ' . $this->faker->numberBetween(1, 12),
                'type' => 'Bin',
            ];
        });
    }
}
