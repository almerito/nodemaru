<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            ShaderCategoriesSeeder::class,
            // ShaderAuthorsSeeder handled by ShadersSeeder logic or manually if needed
            ShadersSeeder::class,
            UsersSeeder::class,
            PatchesSeeder::class,
            RolesAndPermissionsSeeder::class,
        ]);
    }
}
