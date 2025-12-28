// Parameter hints dictionary for Hydra nodes
// Organized by node type, then parameter name

export const PARAM_HINTS = {
    // === SOURCE ===
    osc: {
        frequency: 'Oscillation frequency. Higher = more stripes (default: 60)',
        sync: 'Sync multiplier for animation speed (default: 0.1)',
        offset: 'Color offset / phase shift (default: 0)'
    },
    noise: {
        scale: 'Noise scale. Lower = more zoomed in (default: 10)',
        offset: 'Animation speed offset (default: 0.1)'
    },
    voronoi: {
        scale: 'Cell size. Lower = larger cells (default: 5)',
        speed: 'Animation speed of cell movement (default: 0.3)',
        blending: 'Edge blending between cells (default: 0.3)'
    },
    shape: {
        sides: 'Number of polygon sides (default: 3 = triangle)',
        radius: 'Shape radius, 0-1 normalized (default: 0.3)',
        smoothing: 'Edge softness / anti-aliasing (default: 0.01)'
    },
    gradient: {
        speed: 'Gradient animation speed (default: 0)'
    },
    solid: {
        r: 'Red channel 0-1 (default: 0)',
        g: 'Green channel 0-1 (default: 0)',
        b: 'Blue channel 0-1 (default: 0)',
        a: 'Alpha/opacity 0-1 (default: 1)'
    },

    // === GEOMETRY ===
    rotate: {
        angle: 'Rotation angle in radians (default: 10)',
        speed: 'Rotation animation speed (default: 0)'
    },
    scale: {
        amount: 'Overall scale factor (default: 1.5)',
        xMult: 'X-axis scale multiplier (default: 1)',
        yMult: 'Y-axis scale multiplier (default: 1)',
        offsetX: 'X center offset 0-1 (default: 0.5 = center)',
        offsetY: 'Y center offset 0-1 (default: 0.5 = center)'
    },
    pixelate: {
        pixelX: 'Horizontal pixel count (default: 20)',
        pixelY: 'Vertical pixel count (default: 20)'
    },
    repeat: {
        repeatX: 'Horizontal repetitions (default: 3)',
        repeatY: 'Vertical repetitions (default: 3)',
        offsetX: 'X offset between repeats (default: 0)',
        offsetY: 'Y offset between repeats (default: 0)'
    },
    repeatX: {
        reps: 'Number of horizontal repetitions (default: 3)',
        offset: 'Offset between repeats (default: 0)'
    },
    repeatY: {
        reps: 'Number of vertical repetitions (default: 3)',
        offset: 'Offset between repeats (default: 0)'
    },
    kaleid: {
        nSides: 'Number of kaleidoscope segments (default: 4)'
    },
    scroll: {
        scrollX: 'Horizontal scroll amount (default: 0.5)',
        scrollY: 'Vertical scroll amount (default: 0.5)',
        speedX: 'Horizontal scroll animation speed (default: 0)',
        speedY: 'Vertical scroll animation speed (default: 0)'
    },
    scrollX: {
        scrollX: 'Horizontal scroll amount (default: 0.5)',
        speed: 'Scroll animation speed (default: 0)'
    },
    scrollY: {
        scrollY: 'Vertical scroll amount (default: 0.5)',
        speed: 'Scroll animation speed (default: 0)'
    },

    // === COLOR ===
    posterize: {
        bins: 'Number of color levels per channel (default: 3)',
        gamma: 'Gamma correction curve (default: 0.6)'
    },
    shift: {
        r: 'Red channel shift 0-1 (default: 0.5)',
        g: 'Green channel shift 0-1 (default: 0.5)',
        b: 'Blue channel shift 0-1 (default: 0.5)',
        a: 'Alpha channel shift 0-1 (default: 0.5)'
    },
    invert: {
        amount: 'Inversion amount 0-1 (default: 1 = full invert)'
    },
    contrast: {
        amount: 'Contrast multiplier (default: 1.6)'
    },
    brightness: {
        amount: 'Brightness adjustment -1 to 1 (default: 0.4)'
    },
    luma: {
        threshold: 'Luminance threshold 0-1 (default: 0.5)',
        tolerance: 'Transition softness (default: 0.1)'
    },
    thresh: {
        threshold: 'Threshold level 0-1 (default: 0.5)',
        tolerance: 'Edge softness (default: 0.04)'
    },
    color: {
        r: 'Red multiplier (default: 1)',
        g: 'Green multiplier (default: 1)',
        b: 'Blue multiplier (default: 1)',
        a: 'Alpha multiplier (default: 1)'
    },
    saturate: {
        amount: 'Saturation multiplier (default: 2)'
    },
    hue: {
        hue: 'Hue rotation 0-1 (default: 0.4)'
    },
    colorama: {
        amount: 'HSV shift amount per pixel (default: 0.005)'
    },

    // === BLEND ===
    add: {
        amount: 'Blend amount 0-1 (default: 1)'
    },
    sub: {
        amount: 'Subtraction amount 0-1 (default: 1)'
    },
    blend: {
        amount: 'Blend mix 0-1. 0=first, 1=second (default: 0.5)'
    },
    mult: {
        amount: 'Multiply amount 0-1 (default: 1)'
    },

    // === MODULATE ===
    modulate: {
        amount: 'Modulation strength (default: 0.1)'
    },
    modulateRotate: {
        multiple: 'Rotation multiplier (default: 1)',
        offset: 'Rotation offset (default: 0)'
    },
    modulateKaleid: {
        nSides: 'Kaleidoscope segments (default: 4)'
    },
    modulateScale: {
        multiple: 'Scale multiplier (default: 1)',
        offset: 'Scale offset (default: 1)'
    },
    modulatePixelate: {
        multiple: 'Pixelation multiplier (default: 10)',
        offset: 'Pixelation offset (default: 3)'
    },
    modulateHue: {
        amount: 'Hue modulation amount (default: 1)'
    },
    modulateRepeat: {
        repeatX: 'Horizontal repetitions (default: 3)',
        repeatY: 'Vertical repetitions (default: 3)',
        offsetX: 'X offset (default: 0.5)',
        offsetY: 'Y offset (default: 0.5)'
    },

    // === DATA ===
    array: {
        fit: 'Fit to BPM timing',
        offset: 'Start offset in array',
        fast: 'Fast interpolation 0-1',
        smooth: 'Smooth transition 0-1',
        ease: 'Easing function for transitions'
    },
    lfo: {
        frequency: 'Oscillation frequency (or beats count when measure=beats)',
        measure: 'Time unit: hz, seconds, frames, or beats (BPM sync)',
        range: 'Output value range [min, max]',
        pulse_width: 'Pulse width for square/pulse waves 0-1',
        curve: 'Waveform: sine, square, sawtooth, triangle, pulse, random, s&h, or sync (linear ramp)'
    },
    midi: {
        port: 'MIDI input device',
        channel: 'MIDI channel (1-16 or all)',
        track: 'MIDI data type to read',
        ccNumber: 'CC number 0-127 (when track=CC)',
        transpose: 'Output range mapping [min, max]'
    },
    audio: {
        port: 'Audio input device',
        track: 'Audio feature to analyze',
        bandType: 'Frequency band (when track=bands)',
        transientType: 'Transient type (when track=transients)',
        transpose: 'Output range mapping [min, max]'
    },

    // === EXTERNAL ===
    init: {
        target: 'Source buffer s0-s3',
        type: 'Input source type',
        params: 'Source URL or path',
        options: 'Additional options (JSON)'
    },
    out: {
        target: 'Output buffer o0-o3'
    },

    // === COMPLEX SOURCE NODES ===
    toriiLogo: {
        scale: 'Scale',
        grainDensity: 'Grain density',
        flowSpeed: 'Fractal Detail Level',
        roughness: 'Roughness'
    },
    fractal3d: {
        speed: 'Rotation Speed',
        zoom: 'Zoom Level',
        detail: 'Fractal Detail Level'
    },
    tunnel3d: {
        speed: 'Movement Speed',
        scale: 'Pattern Scale',
        depth: 'Tunnel Depth'
    },

    // === MIGRATED FROM LIBRARYCALLBACKS ===
    altline: {
        width: 'Width',
    },
    ascii: {
        cellSize: 'Cell Size (px)',
        sharpness: 'Sharpness',
        colorIntensity: 'Color Intensity',
    },
    asciiMatrix: {
        cellSize: 'Cell Size (px)',
        speed: 'Animation Speed',
        greenTint: 'Green Tint Amount',
    },
    asciiSimple: {
        cellSize: 'Cell Size (px)',
        contrast: 'Contrast',
    },
    audio: {
        port: 'Audio input device',
    },
    audio_data: {
        source: 'Audio source: microphone or local file',
        track: 'Audio feature to track from Meyda analyzer',
        bandType: 'Frequency band (only for "bands" track)',
        transientType: 'Transient type (only for "transients" track)',
        useAdaptiveRange: 'Auto-adjust input range if values exceed it',
        inputRange: 'Initial input range for mapping (updated if adaptive)',
        transpose: 'Output range mapping',
    },
    blinking: {
        tiles: 'Tiles',
        scale: 'Scale',
        speed: 'Speed',
        phase: 'Phase',
    },
    blobs: {
        speed: 'Speed',
        tresh: 'Threshold',
        soft: 'Softness',
    },
    brick: {
        width: 'Width',
        height: 'Height',
        gap: 'Gap',
    },
    checker: {
        repeats: 'Repeats',
    },
    colboost: {
        amount: 'Amount',
    },
    colcross: {
        amount: 'Amount',
    },
    coldot: {
        amount: 'Amount',
    },
    colornoise: {
        size: 'Size',
        dynamic: 'Dynamic',
    },
    colreflect: {
        amount: 'Amount',
        value: 'Threshold Value',
    },
    concentric: {
        scale: 'Scale',
        centerX: 'Center X',
        centerY: 'Center Y',
    },
    concentric_pattern: {
        base: 'Base',
        octaves: 'Octaves',
        ampscale: 'Amp Scale',
        speed: 'Speed',
    },
    cwarp: {
        scalei: 'Inner Scale',
        offset: 'Offset',
        octaves: 'Octaves',
        octavesinner: 'Inner Octaves',
        scale: 'Scale',
        focus: 'Focus',
    },
    exp: {
        amount: 'Factor',
    },
    forestLight: {
        posX: 'Position x',
        posY: 'Position y',
        density: 'Density',
        speed: 'Speed',
        rayStrength: 'Ray Strength',
        softness: 'Softness',
    },
    fractal3d: {
        speed: 'Rotation Speed',
        zoom: 'Zoom Level',
        detail: 'Fractal Detail Level',
    },
    fractalComplex: {
        speed: 'Animation Speed',
        zoom: 'Camera Zoom',
    },
    fractalPyramid: {
        speed: 'Rotation Speed',
        zoom: 'Camera Zoom',
        colorMix: 'Color Mix (Cyan/Magenta)',
    },
    fractalRing: {
        speed: 'Animation Speed',
        zoom: 'Camera Zoom',
        complexity: 'Ring Segments',
    },
    geodist: {
        speed: 'Animation Speed',
        intensity: 'Color Intensity',
        scale: 'Pattern Scale',
    },
    grarose: {
        amount: 'Amount',
    },
    graua: {
        amount: 'Amount',
    },
    grawave: {
        amount: 'Amount',
    },
    harmonic: {
        frequency: 'Frequency',
        speed: 'Speed',
        phase1: 'Phase 1',
        phase2: 'Phase 2',
    },
    hextile: {
        tiles: 'Tiles',
    },
    hsvshift: {
        hue: 'Hue Shift',
        saturation: 'Saturation',
        value: 'Value',
    },
    iAstroid: {
        freq: 'Freq',
        wrap: 'Wrap',
        amp: 'Amp',
    },
    iBicorn: {
        freq: 'Freq',
        a_exp: 'a_exp',
        a: 'a',
    },
    iCardioid: {
        freq: 'Freq',
        a: 'a',
    },
    iCassOval: {
        freq: 'Freq',
        mult: 'Mult',
        a: 'a',
        c: 'c',
    },
    iCircle: {
        freq: 'Freq',
    },
    iCissoid: {
        freq: 'Freq',
        a: 'a',
        wrap: 'Wrap',
    },
    iCochleoid: {
        freq1: 'Freq 1',
        freq2: 'Freq 2',
        a: 'a',
    },
    iDFolium: {
        freq: 'Freq',
        a: 'a',
    },
    iDevil: {
        freq: 'Freq',
        wrap: 'Wrap',
        k: 'k',
        a: 'a',
    },
    iFermatSpiral: {
        freq: 'Freq',
        a: 'a',
        b: 'b',
    },
    iFreethNephroid: {
        freq1: 'Freq 1',
        freq2: 'Freq 2',
        a: 'a',
    },
    iInvoluteCircle: {
        freq: 'Freq',
        wrap: 'Wrap',
    },
    iSextic: {
        freq1: 'Freq 1',
        freq2: 'Freq 2',
        a: 'a',
    },
    iSluzeConchoid: {
        freq: 'Freq',
        a: 'a',
        k: 'k',
    },
    iSpiral: {
        freq: 'Freq',
        a: 'a',
        b: 'b',
    },
    icosahedron: {
        speed: 'Rotation Speed',
        size: 'Shape Size',
        glow: 'Edge Glow Intensity',
    },
    if_then_else: {
        threshold: 'Threshold',
        operator: 'Operator',
        if_true: 'If True',
        if_false: 'If False',
    },
    ifeven: {
        value: 'Value',
        eps: 'Epsilon',
    },
    ifzero: {
        value: 'Value',
        eps: 'Epsilon',
    },
    kaleidoFog: {
        speed: 'Fog Motion Speed',
        glow: 'Color Intensity',
        distort: 'Geometry Distortion',
    },
    levels: {
        levels: 'Levels',
        amount: 'Amount',
    },
    lissa: {
        time: 'Time Offset',
        frequ: 'Frequency',
        loops: 'Loops',
        thick: 'Thickness',
    },
    lowTechTunnel: {
        speed: 'Movement Speed',
        radius: 'Tunnel Radius',
        detail: 'Noise Detail',
    },
    midi: {
        port: 'MIDI input device',
    },
    midi_data: {
        source: 'MIDI source node',
    },
    monotone: {
        levels: 'Levels',
        hue: 'Hue',
        amount: 'Amount',
    },
    movingBubbles: {
        speed: 'Traffic Speed',
        density: 'Grid Density',
        jitter: 'Movement Amount',
    },
    multiply: {
        amount: 'Multiplier',
    },
    ncontour: {
        thresh: 'Threshold',
        smooth: 'Smoothness',
        octaves: 'Octaves',
        scale: 'Scale',
        speed: 'Speed',
        step: 'Step',
    },
    neonLines: {
        speed: 'Animation Speed',
        lines: 'Number of Lines',
        hue: 'Base Hue (0-1)',
    },
    octgrams: {
        speed: 'Movement Speed',
        zoom: 'Camera Zoom',
        brightness: 'Brightness Level',
    },
    osc: {
        frequency: 'Oscillation Frequency',
    },
    pCrossCap: {
        freq: 'Freq',
        aa: 'aa',
    },
    pCylinder: {
        freq: 'Freq',
        a: 'a',
    },
    pKleinBottle: {
        freq: 'Freq',
        aa: 'aa',
    },
    pMobiusStrip: {
        freq: 'Freq',
        a: 'a',
    },
    pSphere: {
        freq: 'Freq',
        a: 'a',
    },
    pSteiner: {
        freq: 'Freq',
        aa: 'aa',
    },
    pTorus: {
        freq: 'Freq',
        a: 'a',
        c: 'c',
    },
    phasenoise: {
        base: 'Base',
        range: 'Range',
        scale: 'Scale',
        speed: 'Speed',
        phase: 'Phase',
    },
    pulse: {
        edge: 'Edge',
        width: 'Width',
        epsilon: 'Epsilon',
    },
    pulsetrain: {
        train: 'Train Count',
        edge: 'Edge',
        width: 'Width',
        epsilon: 'Epsilon',
    },
    pxsort: {
        threshold: 'Threshold',
        frame: 'Frame',
        dirX: 'Dir X',
        dirY: 'Dir Y',
    },
    pysort: {
        threshold: 'Threshold',
        frame: 'Frame',
        dirX: 'Dir X',
        dirY: 'Dir Y',
    },
    rharmonic: {
        frequency: 'Frequency',
        speed: 'Speed',
        phase1: 'Phase 1',
        phase2: 'Phase 2',
    },
    root: {
        amount: 'Factor',
    },
    round: {
        decimals: 'Decimals',
    },
    rsaw: {
        frequency: 'Frequency',
        speed: 'Speed',
    },
    rsqu: {
        frequency: 'Frequency',
        speed: 'Speed',
    },
    rstripes: {
        frequency: 'Frequency',
        speed: 'Speed',
    },
    rtri: {
        frequency: 'Frequency',
        speed: 'Speed',
    },
    rusin: {
        frequency: 'Frequency',
        speed: 'Speed',
    },
    saw: {
        frequency: 'Frequency',
        speed: 'Speed',
    },
    sdfmove: {
        speed1: 'Speed 1',
        speed2: 'Speed 2',
        speed3: 'Speed 3',
    },
    sepia: {
        amount: 'Amount',
    },
    smooth: {
        size: 'History size',
    },
    smoothsun: {
        threshold: 'Threshold',
        border: 'Border',
        speed: 'Speed',
        ampscale: 'Amp Scale',
    },
    spiral: {
        a: 'A',
        b: 'B',
        thickness: 'Thickness',
    },
    splitview: {
        where: 'Position',
    },
    splitviewh: {
        where: 'Position',
    },
    squ: {
        frequency: 'Frequency',
        speed: 'Speed',
    },
    squareTunnel: {
        speed: 'Animation Speed',
        spacing: 'Square Spacing/Scale',
        rotation: 'Tunnel Rotation',
    },
    stripes: {
        frequency: 'Frequency',
        speed: 'Speed',
    },
    trafficGrid: {
        speed: 'Traffic Speed',
        density: 'Grid Density',
        jitter: 'Traffic Chaos',
    },
    tri: {
        frequency: 'Frequency',
        speed: 'Speed',
    },
    triwave1: {
        speed: 'Animation Speed',
        depth: 'Depth Scale',
        brightness: 'Brightness Level',
    },
    triwave2: {
        speed: 'Animation Speed',
        depth: 'Depth Scale',
        intensity: 'Effect Intensity',
    },
    triwave3: {
        speed: 'Animation Speed',
        depth: 'Depth Scale',
        contrast: 'Contrast Level',
    },
    tunnel3d: {
        speed: 'Movement Speed',
        scale: 'Pattern Scale',
        depth: 'Tunnel Depth',
    },
    turb: {
        scale: 'Scale',
        offset: 'Offset',
        octaves: 'Octaves',
    },
    unoise: {
        scale: 'Scale',
        offset: 'Offset',
    },
    usin: {
        frequency: 'Frequency',
        speed: 'Speed',
    },
    uturb: {
        scale: 'Scale',
        offset: 'Offset',
        octaves: 'Octaves',
    },
    warp: {
        scalei: 'Inner Scale',
        offset: 'Offset',
        octaves: 'Octaves',
        octavesinner: 'Inner Octaves',
        scale: 'Scale',
    },
    wave: {
        time: 'Time Offset',
        frequ: 'Frequency',
        loops: 'Loops',
        thick: 'Thickness',
    },
    whitenoise: {
        size: 'Size',
        dynamic: 'Dynamic',
    },
};

// Helper to get hint for a parameter
export function getParamHint(nodeType, paramName) {
    return PARAM_HINTS[nodeType]?.[paramName] || null;
}
