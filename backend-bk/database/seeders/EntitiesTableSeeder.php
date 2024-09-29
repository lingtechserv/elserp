<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EntitiesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('entities')->insert([
            ['name' => 'EL Science', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Design TeamX', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Phoenix Vapors', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
