<?php



namespace Database\Factories;

use App\Models\RawMaterial;
use Illuminate\Database\Eloquent\Factories\Factory;

class RawMaterialFactory extends Factory
{
    protected $model = RawMaterial::class;

    public function definition()
    {
        $category = $this->faker->numberBetween(1, 5);
        $skuPrefix = match ($category) {
            1 => 'C',
            2 => 'T',
            3 => 'F',
            4 => 'L',
            5 => 'N',
        };

        return [
            'category' => $category,
            'sku' => $skuPrefix . $this->faker->unique()->numerify('#####'),
            'flavour_name' => $this->faker->word,
            'cas' => $category === 3 ? $this->faker->numerify('#####-##-#') : null,
            'einecs' => $category === 3 ? $this->faker->numerify('###-###-#') : null,
            'reach' => $category === 3 ? $this->faker->numerify('#####') : null,
            'fema' => $category === 3 ? $this->faker->numerify('####') : null,
            'flavis' => $category === 3 ? $this->faker->numerify('####') : null,
            'jecfa' => $category === 3 ? $this->faker->numerify('####') : null,
            'strength' => $category === 5 ? $this->faker->randomElement(['Low', 'Medium', 'High']) : null,
            'active' => $this->faker->boolean(90),
        ];
    }
}
