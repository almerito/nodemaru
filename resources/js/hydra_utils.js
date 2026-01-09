
/**
 * hydra_utils.js
 * Shared utilities for executing Hydra code and managing custom shaders over multiple instances.
 */

/**
 * hydra_utils.js
 * Shared utilities for executing Hydra code and managing custom shaders over multiple instances.
 */


// Centralized default assets configuration
export const DEFAULT_ASSETS = {
    'image': '/assets/defaults/image.png',
    'video': '/assets/defaults/video.mp4',
    'audio': '/assets/defaults/audio.mp3'
};

/**
 * Resolve Asset with Fallback
 * Returns an HTML Element for Hydra to use.
 * Handles loading errors by switching to default source.
 */
export function resolveAsset(url, type) {
    // Safety check
    if (!url) url = DEFAULT_ASSETS[type];

    if (type === 'image') {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onerror = () => {
            // Fallback to default
            if (img.src.indexOf(DEFAULT_ASSETS.image) === -1) {
                console.warn(`[resolveAsset] Failed to load image: ${url}. Using default.`);
                img.src = DEFAULT_ASSETS.image;
            }
        };
        img.src = url;
        return img;
    } else if (type === 'video') {
        const vid = document.createElement('video');
        vid.crossOrigin = "anonymous";
        vid.loop = true;
        vid.muted = true;
        vid.playsInline = true;
        vid.autoplay = true;
        vid.onerror = () => {
            if (vid.src.indexOf(DEFAULT_ASSETS.video) === -1) {
                console.warn(`[resolveAsset] Failed to load video: ${url}. Using default.`);
                vid.src = DEFAULT_ASSETS.video;
            }
        };
        vid.src = url;
        // Ensure play
        vid.oncanplay = () => {
            vid.play().catch(e => console.warn("Auto-play prevented", e));
        };
        return vid;
    }
    // Fallback for others (strings)
    return url || DEFAULT_ASSETS[type];
}

/**
 * Fetch Audio with Fallback
 * Verifies if an audio URL is reachable; if not, returns default.
 * Use this for asynchronous checks (e.g. before loading into audio node).
 */
export async function fetchAudioWithFallback(url) {
    if (!url) return DEFAULT_ASSETS.audio;
    try {
        // Use HEAD request to check availability without downloading
        const response = await fetch(url, { method: 'HEAD' });
        if (response.ok) return url;
        console.warn(`[hydra_utils] Audio file not found: ${url}. Using default.`);
    } catch (e) {
        console.warn(`[hydra_utils] Error checking audio: ${url}`, e);
    }
    return DEFAULT_ASSETS.audio;
}

// Global cache for shader definitions (name -> code/json) to avoid re-fetching
const shaderDefinitions = new Map();

// Registry to track which shaders are registered on which instance
// WeakMap<HydraInstance, Set<string>>
const instanceRegistry = new WeakMap();

// Common built-in Hydra functions to skip fetching
export const HYDRA_BUILTINS = [
    'osc', 'noise', 'voronoi', 'shape', 'gradient', 'solid', 'src', 'prev',
    'shift', 'scroll', 'repeat', 'modulate', 'scale', 'rotate', 'kaleid',
    'pixelate', 'saturate', 'hue', 'brightness', 'contrast', 'invert',
    'luma', 'thresh', 'posterize', 'color'
];

/**
 * Fetch and register custom shader functions for a given Hydra instance.
 * @param {Array<string>} shaderNames - List of shader names to load
 * @param {Object} hydraInstance - The Hydra instance (should have .synth or .setFunction)
 */
export async function loadCustomShaders(shaderNames, hydraInstance) {
    if (!shaderNames || shaderNames.length === 0) return;
    if (!hydraInstance) return;

    // Get or create set of registered shaders for this instance
    if (!instanceRegistry.has(hydraInstance)) {
        instanceRegistry.set(hydraInstance, new Set());
    }
    const registeredOnInstance = instanceRegistry.get(hydraInstance);

    // Identify which shaders effectively need to be registered on this instance
    const neededForInstance = shaderNames.filter(name =>
        !HYDRA_BUILTINS.includes(name) && !registeredOnInstance.has(name)
    );

    if (neededForInstance.length === 0) return;

    // Identify which definitions are missing from global cache
    const missingDefinitions = neededForInstance.filter(name => !shaderDefinitions.has(name));

    // Fetch missing definitions
    if (missingDefinitions.length > 0) {
        // De-duplicate
        const uniqueToFetch = [...new Set(missingDefinitions)];

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
            const response = await fetch('/nodes/set-functions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || ''
                },
                body: JSON.stringify({ types: uniqueToFetch })
            });

            if (response.ok) {
                const functions = await response.json();
                for (const [name, code] of Object.entries(functions)) {
                    shaderDefinitions.set(name, code);
                }
            } else {
                console.warn(`[HydraUtils] Failed to fetch definitions: ${response.statusText}`);
            }
        } catch (e) {
            console.error('[HydraUtils] Error fetching custom shaders:', e);
        }
    }

    // Now register all needed shaders onto the instance using cached definitions
    const mapToRegister = {};
    let hasSomething = false;

    neededForInstance.forEach(name => {
        if (shaderDefinitions.has(name)) {
            mapToRegister[name] = shaderDefinitions.get(name);
            hasSomething = true;
        } else {
            // Warn if we still don't have it?
            // console.warn(`[HydraUtils] Definition for ${name} not found despite fetch attempt.`);
        }
    });

    if (hasSomething) {
        await registerSetFunctions(mapToRegister, hydraInstance);

        // Mark as registered
        Object.keys(mapToRegister).forEach(n => registeredOnInstance.add(n));
    }
}

/**
 * Register a batch of setFunctions onto a Hydra instance.
 * @param {Object} functionsMap - Map of name -> code/json
 * @param {Object} hydraInstance 
 */
export async function registerSetFunctions(functionsMap, hydraInstance) {
    const synth = hydraInstance.synth;

    for (const [name, code] of Object.entries(functionsMap)) {
        if (!code) continue;

        try {
            let shaderDef = code;

            // Parse if string (handling double-encoded JSON if happens)
            if (typeof code === 'string') {
                try {
                    shaderDef = JSON.parse(code);
                } catch (e) {
                    // It's raw JS string
                }
            }

            // Sanitization: Remove garbage strings from inputs (e.g. comments in JSON)
            if (shaderDef && Array.isArray(shaderDef.inputs)) {
                shaderDef.inputs = shaderDef.inputs.filter(i => typeof i === 'object' && i !== null);
            }

            // Register
            if (typeof shaderDef === 'object') {
                // Determine correct context for setFunction
                let targetContext = hydraInstance;
                let setFunc = hydraInstance.setFunction;

                if (!setFunc && hydraInstance.synth && hydraInstance.synth.setFunction) {
                    targetContext = hydraInstance.synth;
                    setFunc = hydraInstance.synth.setFunction;
                }

                if (setFunc) {
                    console.log(`[HydraUtils] Registering ${name} on`, targetContext);
                    setFunc.call(targetContext, shaderDef);
                } else if (window.setFunction) {
                    // Fallback to global, but warn because this might affect wrong instance
                    console.warn(`[HydraUtils] Using global setFunction for ${name} (instance isolation compromised)`);
                    window.setFunction(shaderDef);
                } else {
                    console.warn(`[HydraUtils] No setFunction found for ${name} on instance`, hydraInstance);
                    continue; // Skip binding if registration failed
                }
            } else {
                // Legacy raw JS
                const fn = new Function('synth', code);
                fn(synth);
            }

            // Bind to window for global access (needed for eval)
            // Note: This binds the LAST registered instance's method to window.
            // This is okay for single-user context, but be aware.
            if (synth[name] && typeof synth[name] === 'function') {
                window[name] = synth[name].bind(synth);
            }

        } catch (e) {
            console.error(`[HydraUtils] Error registering ${name}:`, e);
        }
    }
}

/**
 * Execute Hydra code on a specific instance.
 * @param {Object} hydraInstance - The target Hydra instance
 * @param {string} code - The code to execute
 * @param {Array<string>} [customShaderNames=[]] - List of custom shaders used in the code
 */
export async function executeHydraCode(hydraInstance, code, customShaderNames = []) {
    if (!hydraInstance) {
        console.error('[HydraUtils] No instance provided');
        return;
    }

    const synth = hydraInstance.synth;
    if (!synth) {
        console.error('[HydraUtils] Instance has no synth');
        return;
    }

    // 1. Load custom shaders if needed
    if (customShaderNames.length > 0) {
        await loadCustomShaders(customShaderNames, hydraInstance);
    }

    // 2. Bind synth methods to window (Environment Setup)
    // This is crucial for "osc()", "src()" to work without "synth.osc()"
    for (const key in synth) {
        // if (Object.prototype.hasOwnProperty.call(synth, key)) { // Removed strict check to allow prototype methods
        if (true) {
            if (typeof synth[key] === 'function') {
                window[key] = synth[key].bind(synth);
            } else if (key === 'time') {
                // Define time as a getter so it always reflects synth.time
                Object.defineProperty(window, 'time', {
                    get: () => synth.time,
                    set: (v) => { /* ignore writes from other instances to avoid crash */ },
                    configurable: true
                });
            } else {
                window[key] = synth[key];
            }
        }
    }
    // Ensure render is bound
    if (synth.render) window.render = synth.render.bind(synth);

    // 3. Expose outputs (o0, o1...) to window
    // Check both synth.o and instance.o
    const outputs = synth.o || hydraInstance.o;
    if (outputs && Array.isArray(outputs)) {
        outputs.forEach((o, i) => {
            window[`o${i}`] = o;
        });
    }

    // 4. Expose sources (s0, s1...)
    const sources = synth.s || hydraInstance.s;
    if (sources && Array.isArray(sources)) {
        sources.forEach((s, i) => {
            window[`s${i}`] = s;
        });
    }

    // 5. Execute Code
    try {
        // Use AsyncFunction to allow await in top-level code if needed
        const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
        const execFn = new AsyncFunction(code);
        await execFn();
    } catch (e) {
        console.error('[HydraUtils] Execution failed:', e);
        console.log('[HydraUtils] Failed Code:\n', code); // Added logging
        throw e; // Re-throw so caller knows
    }
}

/**
 * Extract custom shader names from a graph object.
 * @param {Object} graph - The graph object containing nodes
 * @returns {Array<string>} - List of unique custom shader names
 */
export function extractCustomShaders(graph) {
    if (!graph || !graph.nodes) return [];

    const types = new Set();
    // Common system types to ignore
    const systemTypes = ['out', 'render', 'init', 'midi', 'audio', 'midi_data', 'audio_data', 'lfo', 'array', 'group', 'comment', 'src'];

    graph.nodes.forEach(node => {
        // Check shaderData.name primarily, fallback to node.type
        const name = node.data?.shaderData?.name || node.type;

        if (name && !systemTypes.includes(name) && !HYDRA_BUILTINS.includes(name)) {
            types.add(name);
        }
    });

    return [...types];
}
