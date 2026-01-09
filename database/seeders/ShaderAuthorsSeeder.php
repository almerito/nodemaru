<?php

namespace Database\Seeders;

use App\Models\ShaderAuthor;
use Illuminate\Database\Seeder;

class ShaderAuthorsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $authors = [
            ['name' => 'chronos', 'url' => 'https://www.shadertoy.com/user/chronos'],
            ['name' => 'SnoopethDuckDuck', 'url' => 'https://www.shadertoy.com/user/SnoopethDuckDuck'],
            ['name' => 'bradjamesgrant', 'url' => 'https://www.shadertoy.com/user/bradjamesgrant'],
            ['name' => 'kasari39', 'url' => 'https://www.shadertoy.com/user/kasari39'],
            ['name' => 'Danilo Guanabara', 'url' => 'https://www.shadertoy.com/user/Danguafer'], // Note: Name diff from URL user
            ['name' => 'phreax', 'url' => 'https://www.shadertoy.com/user/phreax'],
            ['name' => 'kishimisu', 'url' => 'https://www.shadertoy.com/user/kishimisu'],
            ['name' => 'mrange', 'url' => 'https://www.shadertoy.com/user/mrange'],
            ['name' => 'hdrp0720', 'url' => 'https://www.shadertoy.com/user/hdrp0720'],
            ['name' => 'diatribes', 'url' => 'https://www.shadertoy.com/user/diatribes'],
            ['name' => 'Farbs', 'url' => 'https://www.shadertoy.com/user/Farbs'],
            ['name' => 'nimitz', 'url' => 'https://www.shadertoy.com/user/nimitz'],
            ['name' => 'flockaroo', 'url' => 'https://www.shadertoy.com/user/flockaroo'],
        ];

        foreach ($authors as $author) {
            ShaderAuthor::firstOrCreate(
                ['name' => $author['name']],
                ['url' => $author['url']]
            );
        }
    }
}
