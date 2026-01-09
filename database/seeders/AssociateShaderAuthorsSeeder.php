<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Shader;
use App\Models\ShaderAuthor;

class AssociateShaderAuthorsSeeder extends Seeder
{
    public function run()
    {
        $map = [
            'glitch_crt' => 'piyushslayer',
            'cubeMatrix' => 'phreax',
            'phantomTunnel' => 'kasari39',
            'supernovaTunnel' => 'Danguafer', // Will map to Danilo Guanabara or lookup by URL
            'fractalZoom' => 'kishimisu',
            'siliconDreams' => 'mrange',
            'viscera' => 'hdrp0720',
            'offworld' => 'diatribes',
            'DesertPassage' => 'Farbs', // DB has camelCase? list_shaders said 'desertPassage'
            'proteanClouds' => 'nimitz',
            'fractalTunnel' => 'diatribes',
            'fireTunnel' => 'diatribes',
            'pencilSketch' => 'flockaroo',
        ];

        // Manual alias mapping for Author names if needed
        $authorAliases = [
            'Danguafer' => 'Danilo Guanabara',
        ];

        $missing = [];
        $updated = [];

        foreach ($map as $shaderName => $authorName) {
            // 1. Resolve Author
            $realAuthorName = $authorAliases[$authorName] ?? $authorName;
            
            // Try explicit name match
            $author = ShaderAuthor::where('name', 'LIKE', $realAuthorName)->first();
            
            // Try lookup by URL if name fails (e.g. for Danguafer if alias missing)
            if (!$author) {
                 $author = ShaderAuthor::where('url', 'LIKE', "%$authorName%")->first();
            }

            if (!$author) {
                // Check if we should auto-create piyushslayer (per instructions "notify me", but if I can't find him, I can't link)
                // Instructions said: "Se non trovi uno sketch o un autore, notificamelo" -> Report.
                $missing[] = "Author '$authorName' for shader '$shaderName' not found.";
                continue;
            }

            // 2. Resolve Shader (Case insensitive search)
            $shader = Shader::where('name', 'LIKE', $shaderName)->first();

            if (!$shader) {
                // Try simpler lookup?
                $missing[] = "Shader '$shaderName' not found.";
                continue;
            }

            // 3. Link
            $shader->shader_author_id = $author->id;
            $shader->save();
            $updated[] = "$shaderName -> $realAuthorName";
        }

        echo "Association complete.\n";
        echo "Updated: " . count($updated) . "\n";
        if (count($missing) > 0) {
            echo "MISSING ITEMS:\n";
            foreach ($missing as $m) echo "- $m\n";
        }
    }
}
