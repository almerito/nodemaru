<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\ShaderAuthor;
use App\Models\ShaderCategory;
use App\Models\ShaderSubcategory;

class ShadersSeeder extends Seeder
{
    private $authorsMap = [];
    private $categoriesMap = [];
    private $subcategoriesMap = [];
    private $shaderLibrary = [];
    private $nodeRegistry = [];
    private $paramHints = [
        // === SOURCE ===
        'osc' => [
            'frequency' => 'Oscillation frequency. Higher = more stripes (default: 60)',
            'sync' => 'Sync multiplier for animation speed (default: 0.1)',
            'offset' => 'Color offset / phase shift (default: 0)'
        ],
        'noise' => [
            'scale' => 'Noise scale. Lower = more zoomed in (default: 10)',
            'offset' => 'Animation speed offset (default: 0.1)'
        ],
        'voronoi' => [
            'scale' => 'Cell size. Lower = larger cells (default: 5)',
            'speed' => 'Animation speed of cell movement (default: 0.3)',
            'blending' => 'Edge blending between cells (default: 0.3)'
        ],
        'shape' => [
            'sides' => 'Number of polygon sides (default: 3 = triangle)',
            'radius' => 'Shape radius, 0-1 normalized (default: 0.3)',
            'smoothing' => 'Edge softness / anti-aliasing (default: 0.01)'
        ],
        'gradient' => [
            'speed' => 'Gradient animation speed (default: 0)'
        ],
        'solid' => [
            'r' => 'Red channel 0-1 (default: 0)',
            'g' => 'Green channel 0-1 (default: 0)',
            'b' => 'Blue channel 0-1 (default: 0)',
            'a' => 'Alpha/opacity 0-1 (default: 1)'
        ],

        // === GEOMETRY ===
        'rotate' => [
            'angle' => 'Rotation angle in radians (default: 10)',
            'speed' => 'Rotation animation speed (default: 0)'
        ],
        'scale' => [
            'amount' => 'Overall scale factor (default: 1.5)',
            'xMult' => 'X-axis scale multiplier (default: 1)',
            'yMult' => 'Y-axis scale multiplier (default: 1)',
            'offsetX' => 'X center offset 0-1 (default: 0.5 = center)',
            'offsetY' => 'Y center offset 0-1 (default: 0.5 = center)'
        ],
        'pixelate' => [
            'pixelX' => 'Horizontal pixel count (default: 20)',
            'pixelY' => 'Vertical pixel count (default: 20)'
        ],
        'repeat' => [
            'repeatX' => 'Horizontal repetitions (default: 3)',
            'repeatY' => 'Vertical repetitions (default: 3)',
            'offsetX' => 'X offset between repeats (default: 0)',
            'offsetY' => 'Y offset between repeats (default: 0)'
        ],
        'repeatX' => [
            'reps' => 'Number of horizontal repetitions (default: 3)',
            'offset' => 'Offset between repeats (default: 0)'
        ],
        'repeatY' => [
            'reps' => 'Number of vertical repetitions (default: 3)',
            'offset' => 'Offset between repeats (default: 0)'
        ],
        'kaleid' => [
            'nSides' => 'Number of kaleidoscope segments (default: 4)'
        ],
        'scroll' => [
            'scrollX' => 'Horizontal scroll amount (default: 0.5)',
            'scrollY' => 'Vertical scroll amount (default: 0.5)',
            'speedX' => 'Horizontal scroll animation speed (default: 0)',
            'speedY' => 'Vertical scroll animation speed (default: 0)'
        ],
        'scrollX' => [
            'scrollX' => 'Horizontal scroll amount (default: 0.5)',
            'speed' => 'Scroll animation speed (default: 0)'
        ],
        'scrollY' => [
            'scrollY' => 'Vertical scroll amount (default: 0.5)',
            'speed' => 'Scroll animation speed (default: 0)'
        ],

        // === COLOR ===
        'posterize' => [
            'bins' => 'Number of color levels per channel (default: 3)',
            'gamma' => 'Gamma correction curve (default: 0.6)'
        ],
        'shift' => [
            'r' => 'Red channel shift 0-1 (default: 0.5)',
            'g' => 'Green channel shift 0-1 (default: 0.5)',
            'b' => 'Blue channel shift 0-1 (default: 0.5)',
            'a' => 'Alpha channel shift 0-1 (default: 0.5)'
        ],
        'invert' => [
            'amount' => 'Inversion amount 0-1 (default: 1 = full invert)'
        ],
        'contrast' => [
            'amount' => 'Contrast multiplier (default: 1.6)'
        ],
        'brightness' => [
            'amount' => 'Brightness adjustment -1 to 1 (default: 0.4)'
        ],
        'luma' => [
            'threshold' => 'Luminance threshold 0-1 (default: 0.5)',
            'tolerance' => 'Transition softness (default: 0.1)'
        ],
        'thresh' => [
            'threshold' => 'Threshold level 0-1 (default: 0.5)',
            'tolerance' => 'Edge softness (default: 0.04)'
        ],
        'color' => [
            'r' => 'Red multiplier (default: 1)',
            'g' => 'Green multiplier (default: 1)',
            'b' => 'Blue multiplier (default: 1)',
            'a' => 'Alpha multiplier (default: 1)'
        ],
        'saturate' => [
            'amount' => 'Saturation multiplier (default: 2)'
        ],
        'hue' => [
            'hue' => 'Hue rotation 0-1 (default: 0.4)'
        ],
        'colorama' => [
            'amount' => 'HSV shift amount per pixel (default: 0.005)'
        ],

        // === BLEND ===
        'add' => [
            'amount' => 'Blend amount 0-1 (default: 1)'
        ],
        'sub' => [
            'amount' => 'Subtraction amount 0-1 (default: 1)'
        ],
        'blend' => [
            'amount' => 'Blend mix 0-1. 0=first, 1=second (default: 0.5)'
        ],
        'mult' => [
            'amount' => 'Multiply amount 0-1 (default: 1)'
        ],

        // === MODULATE ===
        'modulate' => [
            'amount' => 'Modulation strength (default: 0.1)'
        ],
        'modulateRotate' => [
            'multiple' => 'Rotation multiplier (default: 1)',
            'offset' => 'Rotation offset (default: 0)'
        ],
        'modulateKaleid' => [
            'nSides' => 'Kaleidoscope segments (default: 4)'
        ],
        'modulateScale' => [
            'multiple' => 'Scale multiplier (default: 1)',
            'offset' => 'Scale offset (default: 1)'
        ],
        'modulatePixelate' => [
            'multiple' => 'Pixelation multiplier (default: 10)',
            'offset' => 'Pixelation offset (default: 3)'
        ],
        'modulateHue' => [
            'amount' => 'Hue modulation amount (default: 1)'
        ],
        'modulateRepeat' => [
            'repeatX' => 'Horizontal repetitions (default: 3)',
            'repeatY' => 'Vertical repetitions (default: 3)',
            'offsetX' => 'X offset (default: 0.5)',
            'offsetY' => 'Y offset (default: 0.5)'
        ],

        // === DATA ===
        'array' => [
            'fit' => 'Fit to BPM timing',
            'offset' => 'Start offset in array',
            'fast' => 'Fast interpolation 0-1',
            'smooth' => 'Smooth transition 0-1',
            'ease' => 'Easing function for transitions'
        ],
        'lfo' => [
            'frequency' => 'Oscillation frequency (or beats count when measure=beats)',
            'measure' => 'Time unit: hz, seconds, frames, or beats (BPM sync)',
            'range' => 'Output value range [min, max]',
            'pulse_width' => 'Pulse width for square/pulse waves 0-1',
            'curve' => 'Waveform: sine, square, sawtooth, triangle, pulse, random, s&h, or sync (linear ramp)'
        ],
        'midi' => [
            'port' => 'MIDI input device',
            'channel' => 'MIDI channel (1-16 or all)',
            'track' => 'MIDI data type to read',
            'ccNumber' => 'CC number 0-127 (when track=CC)',
            'programNumber' => 'Program number 0-127 (when track=Program Change)',
            'transpose' => 'Output range mapping [min, max]'
        ],
        'audio' => [
            'port' => 'Audio input device',
            'track' => 'Audio feature to analyze',
            'bandType' => 'Frequency band (when track=bands)',
            'transientType' => 'Transient type (when track=transients)',
            'transpose' => 'Output range mapping [min, max]'
        ],

        'audio_data' => [
            'source' => 'Audio source node',
            'track' => 'Audio feature to analyze',
            'bandType' => 'Frequency band (when track=bands)',
            'transientType' => 'Transient type (when track=transients)',
            'useAdaptiveRange' => 'Auto-adjust range based on input',
            'inputRange' => 'Manual input range [min, max]',
            'transpose' => 'Output range mapping [min, max]'
        ],

        // === EXTERNAL ===
        'init' => [
            'target' => 'Source buffer s0-s3',
            'type' => 'Input source type',
            'params' => 'Source URL or path',
            'options' => 'Additional options (JSON)'
        ],
        'out' => [
            'target' => 'Output buffer o0-o3'
        ],

        // === COMPLEX SOURCE NODES ===
        'toriiLogo' => [
            'scale' => 'Scale',
            'grainDensity' => 'Grain density',
            'flowSpeed' => 'Fractal Detail Level',
            'roughness' => 'Roughness'
        ],
        'fractal3d' => [
            'speed' => 'Rotation Speed',
            'zoom' => 'Zoom Level',
            'detail' => 'Fractal Detail Level'
        ],
        'tunnel3d' => [
            'speed' => 'Movement Speed',
            'scale' => 'Pattern Scale',
            'depth' => 'Tunnel Depth'
        ],

        // === MIGRATED FROM LIBRARYCALLBACKS ===
        'altline' => [
            'width' => 'Width',
        ],
        'ascii' => [
            'cellSize' => 'Cell Size (px)',
            'sharpness' => 'Sharpness',
            'colorIntensity' => 'Color Intensity',
        ],
        'asciiMatrix' => [
            'cellSize' => 'Cell Size (px)',
            'speed' => 'Animation Speed',
            'greenTint' => 'Green Tint Amount',
        ],
        'asciiSimple' => [
            'cellSize' => 'Cell Size (px)',
            'contrast' => 'Contrast',
        ],
        'audio_data' => [
            'source' => 'Audio source: microphone or local file',
            'track' => 'Audio feature to track from Meyda analyzer',
            'bandType' => 'Frequency band (only for "bands" track)',
            'transientType' => 'Transient type (only for "transients" track)',
            'useAdaptiveRange' => 'Auto-adjust input range if values exceed it',
            'inputRange' => 'Initial input range for mapping (updated if adaptive)',
            'transpose' => 'Output range mapping',
        ],
        'blinking' => [
            'tiles' => 'Tiles',
            'scale' => 'Scale',
            'speed' => 'Speed',
            'phase' => 'Phase',
        ],
        'blobs' => [
            'speed' => 'Speed',
            'tresh' => 'Threshold',
            'soft' => 'Softness',
        ],
        'brick' => [
            'width' => 'Width',
            'height' => 'Height',
            'gap' => 'Gap',
        ],
        'checker' => [
            'repeats' => 'Repeats',
        ],
        'colboost' => [
            'amount' => 'Amount',
        ],
        'colcross' => [
            'amount' => 'Amount',
        ],
        'coldot' => [
            'amount' => 'Amount',
        ],
        'colornoise' => [
            'size' => 'Size',
            'dynamic' => 'Dynamic',
        ],
        'colreflect' => [
            'amount' => 'Amount',
            'value' => 'Threshold Value',
        ],
        'concentric' => [
            'scale' => 'Scale',
            'centerX' => 'Center X',
            'centerY' => 'Center Y',
        ],
        'concentric_pattern' => [
            'base' => 'Base',
            'octaves' => 'Octaves',
            'ampscale' => 'Amp Scale',
            'speed' => 'Speed',
        ],
        'cwarp' => [
            'scalei' => 'Inner Scale',
            'offset' => 'Offset',
            'octaves' => 'Octaves',
            'octavesinner' => 'Inner Octaves',
            'scale' => 'Scale',
            'focus' => 'Focus',
        ],
        'exp' => [
            'amount' => 'Factor',
        ],
        'forestLight' => [
            'posX' => 'Position x',
            'posY' => 'Position y',
            'density' => 'Density',
            'speed' => 'Speed',
            'rayStrength' => 'Ray Strength',
            'softness' => 'Softness',
        ],
        'fractalComplex' => [
            'speed' => 'Animation Speed',
            'zoom' => 'Camera Zoom',
        ],
        'fractalPyramid' => [
            'speed' => 'Rotation Speed',
            'zoom' => 'Camera Zoom',
            'colorMix' => 'Color Mix (Cyan/Magenta)',
        ],
        'fractalRing' => [
            'speed' => 'Animation Speed',
            'zoom' => 'Camera Zoom',
            'complexity' => 'Ring Segments',
        ],
        'geodist' => [
            'speed' => 'Animation Speed',
            'intensity' => 'Color Intensity',
            'scale' => 'Pattern Scale',
        ],
        'grarose' => [
            'amount' => 'Amount',
        ],
        'graua' => [
            'amount' => 'Amount',
        ],
        'grawave' => [
            'amount' => 'Amount',
        ],
        'harmonic' => [
            'frequency' => 'Frequency',
            'speed' => 'Speed',
            'phase1' => 'Phase 1',
            'phase2' => 'Phase 2',
        ],
        'hextile' => [
            'tiles' => 'Tiles',
        ],
        'hsvshift' => [
            'hue' => 'Hue Shift',
            'saturation' => 'Saturation',
            'value' => 'Value',
        ],
        'iAstroid' => [
            'freq' => 'Freq',
            'wrap' => 'Wrap',
            'amp' => 'Amp',
        ],
        'iBicorn' => [
            'freq' => 'Freq',
            'a_exp' => 'a_exp',
            'a' => 'a',
        ],
        'iCardioid' => [
            'freq' => 'Freq',
            'a' => 'a',
        ],
        'iCassOval' => [
            'freq' => 'Freq',
            'mult' => 'Mult',
            'a' => 'a',
            'c' => 'c',
        ],
        'iCircle' => [
            'freq' => 'Freq',
        ],
        'iCissoid' => [
            'freq' => 'Freq',
            'a' => 'a',
            'wrap' => 'Wrap',
        ],
        'iCochleoid' => [
            'freq1' => 'Freq 1',
            'freq2' => 'Freq 2',
            'a' => 'a',
        ],
        'iDFolium' => [
            'freq' => 'Freq',
            'a' => 'a',
        ],
        'iDevil' => [
            'freq' => 'Freq',
            'wrap' => 'Wrap',
            'k' => 'k',
            'a' => 'a',
        ],
        'iFermatSpiral' => [
            'freq' => 'Freq',
            'a' => 'a',
            'b' => 'b',
        ],
        'iFreethNephroid' => [
            'freq1' => 'Freq 1',
            'freq2' => 'Freq 2',
            'a' => 'a',
        ],
        'iInvoluteCircle' => [
            'freq' => 'Freq',
            'wrap' => 'Wrap',
        ],
        'iSextic' => [
            'freq1' => 'Freq 1',
            'freq2' => 'Freq 2',
            'a' => 'a',
        ],
        'iSluzeConchoid' => [
            'freq' => 'Freq',
            'a' => 'a',
            'k' => 'k',
        ],
        'iSpiral' => [
            'freq' => 'Freq',
            'a' => 'a',
            'b' => 'b',
        ],
        'icosahedron' => [
            'speed' => 'Rotation Speed',
            'size' => 'Shape Size',
            'glow' => 'Edge Glow Intensity',
        ],
        'if_then_else' => [
            'threshold' => 'Threshold',
            'operator' => 'Operator',
            'if_true' => 'If True',
            'if_false' => 'If False',
        ],
        'ifeven' => [
            'value' => 'Value',
            'eps' => 'Epsilon',
        ],
        'ifzero' => [
            'value' => 'Value',
            'eps' => 'Epsilon',
        ],
        'kaleidoFog' => [
            'speed' => 'Fog Motion Speed',
            'glow' => 'Color Intensity',
            'distort' => 'Geometry Distortion',
        ],
        'levels' => [
            'levels' => 'Levels',
            'amount' => 'Amount',
        ],
        'lissa' => [
            'time' => 'Time Offset',
            'frequ' => 'Frequency',
            'loops' => 'Loops',
            'thick' => 'Thickness',
        ],
        'lowTechTunnel' => [
            'speed' => 'Movement Speed',
            'radius' => 'Tunnel Radius',
            'detail' => 'Noise Detail',
        ],
        'midi_data' => [
            'source' => 'MIDI source node',
        ],
        'monotone' => [
            'levels' => 'Levels',
            'hue' => 'Hue',
            'amount' => 'Amount',
        ],
        'movingBubbles' => [
            'speed' => 'Traffic Speed',
            'density' => 'Grid Density',
            'jitter' => 'Movement Amount',
        ],
        'multiply' => [
            'amount' => 'Multiplier',
        ],
        'ncontour' => [
            'thresh' => 'Threshold',
            'smooth' => 'Smoothness',
            'octaves' => 'Octaves',
            'scale' => 'Scale',
            'speed' => 'Speed',
            'step' => 'Step',
        ],
        'neonLines' => [
            'speed' => 'Animation Speed',
            'lines' => 'Number of Lines',
            'hue' => 'Base Hue (0-1)',
        ],
        'octgrams' => [
            'speed' => 'Movement Speed',
            'zoom' => 'Camera Zoom',
            'brightness' => 'Brightness Level',
        ],
        'pCrossCap' => [
            'freq' => 'Freq',
            'aa' => 'aa',
        ],
        'pCylinder' => [
            'freq' => 'Freq',
            'a' => 'a',
        ],
        'pKleinBottle' => [
            'freq' => 'Freq',
            'aa' => 'aa',
        ],
        'pMobiusStrip' => [
            'freq' => 'Freq',
            'a' => 'a',
        ],
        'pSphere' => [
            'freq' => 'Freq',
            'a' => 'a',
        ],
        'pSteiner' => [
            'freq' => 'Freq',
            'aa' => 'aa',
        ],
        'pTorus' => [
            'freq' => 'Freq',
            'a' => 'a',
            'c' => 'c',
        ],
        'phasenoise' => [
            'base' => 'Base',
            'range' => 'Range',
            'scale' => 'Scale',
            'speed' => 'Speed',
            'phase' => 'Phase',
        ],
        'pulse' => [
            'edge' => 'Edge',
            'width' => 'Width',
            'epsilon' => 'Epsilon',
        ],
        'pulsetrain' => [
            'train' => 'Train Count',
            'edge' => 'Edge',
            'width' => 'Width',
            'epsilon' => 'Epsilon',
        ],
        'pxsort' => [
            'threshold' => 'Threshold',
            'frame' => 'Frame',
            'dirX' => 'Dir X',
            'dirY' => 'Dir Y',
        ],
        'pysort' => [
            'threshold' => 'Threshold',
            'frame' => 'Frame',
            'dirX' => 'Dir X',
            'dirY' => 'Dir Y',
        ],
        'rharmonic' => [
            'frequency' => 'Frequency',
            'speed' => 'Speed',
            'phase1' => 'Phase 1',
            'phase2' => 'Phase 2',
        ],
        'root' => [
            'amount' => 'Factor',
        ],
        'round' => [
            'decimals' => 'Decimals',
        ],
        'rsaw' => [
            'frequency' => 'Frequency',
            'speed' => 'Speed',
        ],
        'rsqu' => [
            'frequency' => 'Frequency',
            'speed' => 'Speed',
        ],
        'rstripes' => [
            'frequency' => 'Frequency',
            'speed' => 'Speed',
        ],
        'rtri' => [
            'frequency' => 'Frequency',
            'speed' => 'Speed',
        ],
        'rusin' => [
            'frequency' => 'Frequency',
            'speed' => 'Speed',
        ],
        'saw' => [
            'frequency' => 'Frequency',
            'speed' => 'Speed',
        ],
        'sdfmove' => [
            'speed1' => 'Speed 1',
            'speed2' => 'Speed 2',
            'speed3' => 'Speed 3',
        ],
        'sepia' => [
            'amount' => 'Amount',
        ],
        'smooth' => [
            'size' => 'History size',
        ],
        'smoothsun' => [
            'threshold' => 'Threshold',
            'border' => 'Border',
            'speed' => 'Speed',
            'ampscale' => 'Amp Scale',
        ],
        'spiral' => [
            'a' => 'A',
            'b' => 'B',
            'thickness' => 'Thickness',
        ],
        'splitview' => [
            'where' => 'Position',
        ],
        'splitviewh' => [
            'where' => 'Position',
        ],
        'squ' => [
            'frequency' => 'Frequency',
            'speed' => 'Speed',
        ],
        'squareTunnel' => [
            'speed' => 'Animation Speed',
            'spacing' => 'Square Spacing/Scale',
            'rotation' => 'Tunnel Rotation',
        ],
        'stripes' => [
            'frequency' => 'Frequency',
            'speed' => 'Speed',
        ],
        'trafficGrid' => [
            'speed' => 'Traffic Speed',
            'density' => 'Grid Density',
            'jitter' => 'Traffic Chaos',
        ],
        'tri' => [
            'frequency' => 'Frequency',
            'speed' => 'Speed',
        ],
        'triwave1' => [
            'speed' => 'Animation Speed',
            'depth' => 'Depth Scale',
            'brightness' => 'Brightness Level',
        ],
        'triwave2' => [
            'speed' => 'Animation Speed',
            'depth' => 'Depth Scale',
            'intensity' => 'Effect Intensity',
        ],
        'triwave3' => [
            'speed' => 'Animation Speed',
            'depth' => 'Depth Scale',
            'contrast' => 'Contrast Level',
        ],
        'turb' => [
            'scale' => 'Scale',
            'offset' => 'Offset',
            'octaves' => 'Octaves',
        ],
        'unoise' => [
            'scale' => 'Scale',
            'offset' => 'Offset',
        ],
        'usin' => [
            'frequency' => 'Frequency',
            'speed' => 'Speed',
        ],
        'uturb' => [
            'scale' => 'Scale',
            'offset' => 'Offset',
            'octaves' => 'Octaves',
        ],
        'warp' => [
            'scalei' => 'Inner Scale',
            'offset' => 'Offset',
            'octaves' => 'Octaves',
            'octavesinner' => 'Inner Octaves',
            'scale' => 'Scale',
        ],
        'wave' => [
            'time' => 'Time Offset',
            'frequ' => 'Frequency',
            'loops' => 'Loops',
            'thick' => 'Thickness',
        ],
        'whitenoise' => [
            'size' => 'Size',
            'dynamic' => 'Dynamic',
        ],
    ];

    public function run()
    {
        // 1. Truncate Shaders Table
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('shaders')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 2. Seed Authors
        $this->seedAuthors();

        // 2. Load Categories and Subcategories Maps
        $this->loadCategoriesMaps();

        // 3. Parse Shader Files (GLSL & Inputs)
        $this->parseShaderFiles();

        // 4. Parse Node Files (UI & Metadata)
        $this->parseNodeFiles();

        // 5. Merge and Insert
        $this->mergeAndSeed();
    }

    private function seedAuthors()
    {
        $authorsData = [
            'MaximilianAscari.js' => ['name' => 'Maximilian Ascari', 'url' => 'https://midi.maximilianascari.it'],
            'HydraFCS.js' => ['name' => 'Yoni Maltsman', 'url' => 'https://github.com/ymaltsman/Hydra-FCS'],
            'extra-shaders-for-hydra.js' => ['name' => 'Thomas Jourdan', 'url' => 'https://gitlab.com/metagrowing/'],
            'default' => ['name' => 'Hydra', 'url' => 'https://hydra.ojack.xyz/']
        ];

        foreach ($authorsData as $key => $data) {
            DB::table('shader_authors')->updateOrInsert(
                ['name' => $data['name']],
                ['url' => $data['url'], 'created_at' => now(), 'updated_at' => now()]
            );
            
            $id = DB::table('shader_authors')->where('name', $data['name'])->value('id');
            $this->authorsMap[$key] = $id;
        }

        $coreId = $this->authorsMap['default'];
        $this->authorsMap['hydra-synth.js'] = $coreId;
        $this->authorsMap['runtime-helpers.js'] = $coreId;
    }

    private function loadCategoriesMaps()
    {
        $this->categoriesMap = DB::table('shader_categories')->pluck('id', 'name')->toArray();
        
        // Create composite key map for subcategories: "category_id:subcategory_name" => subcategory_id
        // This allows subcategories with the same name across different categories
        $subcategories = DB::table('shader_subcategories')->get();
        $this->subcategoriesMap = [];
        foreach ($subcategories as $sub) {
            $key = $sub->shader_category_id . ':' . $sub->name;
            $this->subcategoriesMap[$key] = $sub->id;
        }
    }

    private function parseShaderFiles()
    {
        $path = base_path('old/shaders');
        $files = glob($path . '/*.js');

        foreach ($files as $file) {
            $filename = basename($file);
            $content = file_get_contents($file);
            $authorId = $this->resolveAuthor($filename);

            $offset = 0;
            while (preg_match('/setFunction\s*\(\s*\{/', $content, $matches, PREG_OFFSET_CAPTURE, $offset)) {
                $startPos = $matches[0][1];
                $braceStart = strpos($content, '{', $startPos);
                $block = $this->extractBracedBlock($content, $braceStart);
                
                if ($block) {
                    $shaderData = $this->parseJsObjectRecursive($block);
                    if (isset($shaderData['name'])) {
                        $shaderData['author_id'] = $authorId;
                        $this->shaderLibrary[$shaderData['name']] = $shaderData;
                    }
                }
                
                $offset = $startPos + strlen($matches[0][0]);
            }
        }
    }

    private function parseNodeFiles()
    {
        $path = base_path('old/src/ui/nodes');
        $files = glob($path . '/*.js');

        foreach ($files as $file) {
            $content = file_get_contents($file);
            
            $offset = 0;
            while (preg_match("/'([a-zA-Z0-9_]+)'\s*:\s*\{/", $content, $matches, PREG_OFFSET_CAPTURE, $offset)) {
                $key = $matches[1][0];
                $startPos = $matches[0][1];
                $braceStart = strpos($content, '{', $startPos);
                $block = $this->extractBracedBlock($content, $braceStart);
                
                if ($block) {
                    $nodeData = $this->parseJsObjectRecursive($block);
                    $nodeData['key'] = $key;
                    $this->nodeRegistry[$key] = $nodeData;
                }

                $offset = $startPos + 1;
            }
        }
    }

    private function mergeAndSeed()
    {
        $count = 0;
        foreach ($this->nodeRegistry as $key => $nodeData) {
            $shaderData = $this->shaderLibrary[$key] ?? null;
            
            $categoryName = $nodeData['category'] ?? 'source';
            $categoryId = $this->categoriesMap[$categoryName] ?? $this->categoriesMap['source'] ?? 1;

            // Get subcategory using composite key (category_id:subcategory_name)
            $subcategoryName = $nodeData['subcategory'] ?? 'general';
            $subcategoryKey = $categoryId . ':' . $subcategoryName;
            // Fallback to 'general' subcategory of the same category if specified subcategory not found
            $subcategoryId = $this->subcategoriesMap[$subcategoryKey] 
                ?? $this->subcategoriesMap[$categoryId . ':general'] 
                ?? null;

            // Inject hints and order
            if (isset($nodeData['params']) && is_array($nodeData['params'])) {
                $paramIndex = 0;
                foreach ($nodeData['params'] as $paramName => &$paramConfig) {
                    $hint = $this->paramHints[$key][$paramName] ?? null;
                    // Add order based on definition position
                    $paramConfig['order'] = $paramIndex++;
                }
            }

            // Determine Type and Classname
            // Default to 'shader' type and 'ShaderNode' class for most visual generators
            $type = 'shader';
            $classname = 'ShaderNode'; 

            switch ($key) {
                case 'array':
                    $type = 'system';
                    $classname = 'ArrayNode';
                    break;
                case 'lfo':
                    $type = 'system';
                    $classname = 'LfoNode';
                    break;
                case 'midi_data':
                    $type = 'system';
                    $classname = 'MidiDataNode';
                    break;
                case 'audio_data':
                    $type = 'system';
                    $classname = 'AudioDataNode';
                    break;
                case 'data_math':
                    $type = 'system';
                    $classname = 'DataMathNode';
                    break;
                case 'init':
                    $type = 'system'; // Or shader? It's logic.
                    $classname = 'InitNode';
                    break;
                case 'audio':
                    $type = 'system'; 
                    $classname = 'AudioNode';
                    break;
                case 'midi':
                    $type = 'system';
                    $classname = 'MidiNode';
                    break;
                // Output/Render are often part of the graph handling, assuming there are node definitions for them
            }

            // Check shader data for strict types if key is generic
            // For now, relying on key is sufficient as SourceNodes.js uses specific keys.
            // If it is a standard source like 'osc', 'shape', it falls to default SrcNode.

            $record = [
                'name' => $key,
                'label' => $nodeData['name'] ?? ucfirst($key),
                'shader_category_id' => $categoryId,
                'shader_subcategory_id' => $subcategoryId,
                'shader_author_id' => $shaderData['author_id'] ?? $this->authorsMap['default'],
                
                'has_input' => $nodeData['hasInput'] ?? false,
                'has_output' => $nodeData['hasOutput'] ?? false,
                'has_param_input' => $nodeData['hasParamInput'] ?? false,
                'has_param_output' => $nodeData['hasParamOutput'] ?? false,
                
                'accept_nodes' => isset($nodeData['acceptNodes']) ? json_encode($nodeData['acceptNodes']) : null,
                'accept_params' => isset($nodeData['acceptParams']) ? json_encode($nodeData['acceptParams']) : null,
                'params' => isset($nodeData['params']) ? json_encode($nodeData['params']) : null,
                'options' => isset($nodeData['options']) ? json_encode($nodeData['options']) : null,
                'set_function' => $shaderData ? json_encode($shaderData) : null,
                
                'is_active' => true,
                'type' => $type,
                'classname' => $classname,
                'order' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ];
            
            DB::table('shaders')->updateOrInsert(
                ['name' => $key],
                $record
            );
            $count++;
        }
        
        $this->command->info("Seeded {$count} shaders.");
    }

    // ================== Recursive JS Parser ==================

    /**
     * Recursively parse a JS object string into a PHP array
     * Handles nested objects, arrays, strings, numbers, and booleans
     */
    private function parseJsObjectRecursive($str)
    {
        $str = trim($str);
        
        // Remove outer braces if present
        if (str_starts_with($str, '{') && str_ends_with($str, '}')) {
            $str = substr($str, 1, -1);
        }
        
        $result = [];
        $pos = 0;
        $len = strlen($str);
        
        while ($pos < $len) {
            // Skip whitespace and commas
            while ($pos < $len && (ctype_space($str[$pos]) || $str[$pos] === ',')) {
                $pos++;
            }
            
            if ($pos >= $len) break;
            
            // Parse key
            $key = $this->parseKey($str, $pos);
            if ($key === null) break;
            
            // Skip colon and whitespace
            while ($pos < $len && ($str[$pos] === ':' || ctype_space($str[$pos]))) {
                $pos++;
            }
            
            // Parse value
            $value = $this->parseValue($str, $pos);
            
            if ($key !== null) {
                $result[$key] = $value;
            }
        }
        
        return $result;
    }

    /**
     * Parse a key from JS object (supports 'key', "key", and bare key)
     */
    private function parseKey(&$str, &$pos)
    {
        $len = strlen($str);
        
        // Skip whitespace
        while ($pos < $len && ctype_space($str[$pos])) {
            $pos++;
        }
        
        if ($pos >= $len) return null;
        
        $char = $str[$pos];
        
        // Quoted key
        if ($char === "'" || $char === '"') {
            $quote = $char;
            $pos++;
            $key = '';
            while ($pos < $len && $str[$pos] !== $quote) {
                if ($str[$pos] === '\\' && $pos + 1 < $len) {
                    $pos++;
                }
                $key .= $str[$pos];
                $pos++;
            }
            $pos++; // skip closing quote
            return $key;
        }
        
        // Bare key (identifier)
        if (ctype_alpha($char) || $char === '_') {
            $key = '';
            while ($pos < $len && (ctype_alnum($str[$pos]) || $str[$pos] === '_')) {
                $key .= $str[$pos];
                $pos++;
            }
            return $key;
        }
        
        return null;
    }

    /**
     * Parse a value from JS (object, array, string, number, boolean)
     */
    private function parseValue(&$str, &$pos)
    {
        $len = strlen($str);
        
        // Skip whitespace
        while ($pos < $len && ctype_space($str[$pos])) {
            $pos++;
        }
        
        if ($pos >= $len) return null;
        
        $char = $str[$pos];
        
        // Object
        if ($char === '{') {
            $block = $this->extractBracedBlockAtPos($str, $pos);
            $pos += strlen($block);
            return $this->parseJsObjectRecursive($block);
        }
        
        // Array
        if ($char === '[') {
            return $this->parseArray($str, $pos);
        }
        
        // Backtick string (template literal)
        if ($char === '`') {
            $pos++;
            $value = '';
            while ($pos < $len && $str[$pos] !== '`') {
                if ($str[$pos] === '\\' && $pos + 1 < $len) {
                    $value .= $str[$pos];
                    $pos++;
                }
                $value .= $str[$pos];
                $pos++;
            }
            $pos++; // skip closing backtick
            return $value;
        }
        
        // Quoted string
        if ($char === "'" || $char === '"') {
            $quote = $char;
            $pos++;
            $value = '';
            while ($pos < $len && $str[$pos] !== $quote) {
                if ($str[$pos] === '\\' && $pos + 1 < $len) {
                    $pos++;
                }
                $value .= $str[$pos];
                $pos++;
            }
            $pos++; // skip closing quote
            return $value;
        }
        
        // Boolean or number or identifier
        $token = '';
        while ($pos < $len && !in_array($str[$pos], [',', '}', ']', "\n", "\r"])) {
            $token .= $str[$pos];
            $pos++;
        }
        $token = trim($token);
        
        // Boolean
        if ($token === 'true') return true;
        if ($token === 'false') return false;
        if ($token === 'null' || $token === 'undefined') return null;
        
        // Number
        if (is_numeric($token)) {
            return strpos($token, '.') !== false ? (float)$token : (int)$token;
        }
        
        return $token;
    }

    /**
     * Parse an array [...] from JS
     */
    private function parseArray(&$str, &$pos)
    {
        $len = strlen($str);
        $pos++; // skip opening [
        $result = [];
        
        while ($pos < $len) {
            // Skip whitespace and commas
            while ($pos < $len && (ctype_space($str[$pos]) || $str[$pos] === ',')) {
                $pos++;
            }
            
            if ($pos >= $len || $str[$pos] === ']') {
                $pos++; // skip closing ]
                break;
            }
            
            $value = $this->parseValue($str, $pos);
            if ($value !== null) {
                $result[] = $value;
            }
        }
        
        return $result;
    }

    /**
     * Extract a braced block starting at position $startIndex
     */
    private function extractBracedBlockAtPos($content, $startIndex)
    {
        $depth = 0;
        $len = strlen($content);
        $extracted = '';
        
        for ($i = $startIndex; $i < $len; $i++) {
            $char = $content[$i];
            $extracted .= $char;
            
            if ($char === '{') {
                $depth++;
            } elseif ($char === '}') {
                $depth--;
                if ($depth === 0) {
                    return $extracted;
                }
            }
        }
        return $extracted;
    }

    // ================== Helpers ==================

    private function resolveAuthor($filename)
    {
        return $this->authorsMap[$filename] ?? $this->authorsMap['default'];
    }

    private function extractBracedBlock($content, $startIndex)
    {
        $depth = 0;
        $len = strlen($content);
        $extracted = '';
        
        for ($i = $startIndex; $i < $len; $i++) {
            $char = $content[$i];
            $extracted .= $char;
            
            if ($char === '{') {
                $depth++;
            } elseif ($char === '}') {
                $depth--;
                if ($depth === 0) {
                    return $extracted;
                }
            }
        }
        return null;
    }
}
