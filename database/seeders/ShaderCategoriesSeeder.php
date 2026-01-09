<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ShaderCategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // 1. Truncate tables to start fresh (optional, but good for idempotent runs)
        // Disable foreign key checks to allow truncation
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('shader_subcategories')->truncate();
        DB::table('shader_categories')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $now = Carbon::now();

        // 2. Define Data Structure
        $categories = [
            [
                'name' => 'source',
                'label' => 'Source',
                'color' => '#e74c3c', // Red
                'order' => 10,
                'subcategories' => [
                    ['name' => 'complex', 'label' => 'Complex', 'order' => 20],
                    ['name' => 'source_input', 'label' => 'Input', 'order' => 30],  
                    ['name' => 'shapes', 'label' => 'Shapes', 'order' => 40], 
                    ['name' => 'oscillators', 'label' => 'Oscillators', 'order' => 50],
                    ['name' => 'noises', 'label' => 'Noises', 'order' => 60],
                    ['name' => 'colored', 'label' => 'Colored', 'order' => 70],
                    ['name' => 'patterns', 'label' => 'Patterns', 'order' => 80],
                    ['name' => 'fcs', 'label' => 'FCS Curves', 'order' => 90],
                ]
            ],
            [
                'name' => 'ext_source',
                'label' => 'Ext. Source',
                'color' => '#34495e', // Dark Blue
                'order' => 20,
                'subcategories' => [
                    ['name' => 'general', 'label' => 'General', 'order' => 10],
                ]
            ],
            [
                'name' => 'geometry',
                'label' => 'Geometry',
                'color' => '#f1c40f', // Yellow
                'order' => 30,
                'subcategories' => [
                    ['name' => 'general', 'label' => 'General', 'order' => 10],
                ]
            ],
            [
                'name' => 'color',
                'label' => 'Color',
                'color' => '#2ecc71', // Green
                'order' => 40,
                'subcategories' => [
                    ['name' => 'general', 'label' => 'General', 'order' => 10],
                    ['name' => 'source_input', 'label' => 'Source Input', 'order' => 20],
                ]
            ],
            [
                'name' => 'blend',
                'label' => 'Blend',
                'color' => '#3498db', // Blue
                'order' => 50,
                 'subcategories' => [
                    ['name' => 'general', 'label' => 'General', 'order' => 10],
                ]
            ],
            [
                'name' => 'modulate',
                'label' => 'Modulate',
                'color' => '#9b59b6', // Purple
                'order' => 60,
                'subcategories' => [
                    ['name' => 'general', 'label' => 'General', 'order' => 10],
                    ['name' => 'fcs', 'label' => 'FCS Curves', 'order' => 20],
                ]
            ],
            [
                'name' => 'data',
                'label' => 'Data', // Sometimes used interchangeably with Math
                'color' => '#e67e22', // Orange
                'order' => 70,
                'subcategories' => [
                    ['name' => 'general', 'label' => 'General', 'order' => 10],
                ]
            ],
            [
                'name' => 'data_math',
                'label' => 'Data Math',
                'color' => '#1abc9c', // Cyan
                'order' => 80,
                'subcategories' => [
                    ['name' => 'general', 'label' => 'General', 'order' => 10],
                ]
            ],
            [
                'name' => 'output',
                'label' => 'Output',
                'color' => '#95a5a6', // Gray
                'order' => 90,
                'subcategories' => [
                    ['name' => 'general', 'label' => 'General', 'order' => 10],
                ]
            ],
        ];

        // 3. Insert Data
        foreach ($categories as $catData) {
            $subcats = $catData['subcategories'];
            unset($catData['subcategories']);

            $catData['created_at'] = $now;
            $catData['updated_at'] = $now;
            $catData['is_active'] = true;

            $categoryId = DB::table('shader_categories')->insertGetId($catData);

            foreach ($subcats as $subData) {
                $subData['shader_category_id'] = $categoryId;
                $subData['created_at'] = $now;
                $subData['updated_at'] = $now;
                $subData['is_active'] = true;
                
                DB::table('shader_subcategories')->insert($subData);
            }
        }
    }
}
