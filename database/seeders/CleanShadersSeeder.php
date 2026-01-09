<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CleanShadersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $shaders = DB::table('shaders')->get();

        foreach ($shaders as $shader) {
            if (empty($shader->set_function)) {
                continue;
            }

            $currentJson = $shader->set_function;
            
            // 1. Decode JSON
            $data = json_decode($currentJson, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                $this->command->warn("Skipping shader ID {$shader->id} ({$shader->name}): Invalid JSON.");
                continue;
            }

            $modified = false;

            // 2. Clean 'inputs' array (Remove garbage strings/comments)
            if (isset($data['inputs']) && is_array($data['inputs'])) {
                $originalCount = count($data['inputs']);
                $data['inputs'] = array_values(array_filter($data['inputs'], function ($item) {
                    return is_array($item); // Keep only objects (arrays in PHP assoc)
                }));
                
                if (count($data['inputs']) !== $originalCount) {
                    $modified = true;
                }
            }

            // 3. Clean 'glsl' string (Remove comments, normalize newlines)
            if (isset($data['glsl'])) {
                 // If it's array, join it back to string
                 if (is_array($data['glsl'])) {
                    $originalGlsl = implode("\n", $data['glsl']);
                 } else {
                    $originalGlsl = $data['glsl'];
                 }
                
                $cleanedGlsl = $this->cleanGlslCode($originalGlsl);

                // Revert: Keep as string
                $data['glsl'] = $cleanedGlsl;
                $modified = true;
            }
             // 4. Clean 'helpers' string
             if (isset($data['helpers'])) {
                 if (is_array($data['helpers'])) {
                    $originalHelpers = implode("\n", $data['helpers']);
                 } else {
                    $originalHelpers = $data['helpers'];
                 }
                
                $cleanedHelpers = $this->cleanGlslCode($originalHelpers);
                
                // Revert: Keep as string
                $data['helpers'] = $cleanedHelpers;
                $modified = true;
            }

            // 5. Save if modified
            if ($modified) {
                $newJson = json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

                DB::table('shaders')
                    ->where('id', $shader->id)
                    ->update(['set_function' => $newJson]);
                
                $this->command->info("Cleaned shader: {$shader->name}");
            }
        }
    }

    private function cleanGlslCode($code)
    {
        // 0. Replace literal "\n" (backslash + n) with real newline
        $code = str_replace('\\n', "\n", $code);

        // 1. Remove \r (Normalize to \n)
        $code = str_replace("\r", "", $code);

        // 2. Remove Single Line Comments (// ...)
        // We use a regex. Be careful not to remove // inside strings (though rare in GLSL)
        $code = preg_replace('#//.*#', '', $code);

        // 3. Remove Block Comments (/* ... */)
        $code = preg_replace('#/\*.*?\*/#s', '', $code);

        // 4. Trim redundant empty lines (multiple \n -> single \n)
        $code = preg_replace("/\n+/", "\n", $code);

        // 5. Trim leading/trailing whitespace
        $code = trim($code);

        return $code;
    }
}
