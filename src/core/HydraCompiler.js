// Configuration for Meyda audio feature ranges
import { NODES_CONFIG } from '../ui/LibraryCallbacks.js';
// These define the expected input ranges for each audio track type
// 'adaptive' = true means the range can be auto-adjusted at runtime if values exceed it
// Used for transpose/mapping to output range
const MEYDA_AUDIO_RANGES = {
    // === Time-domain features ===

    // Time track - cycles every N seconds (custom, not from Meyda)
    time: { min: 0, max: 10, adaptive: false },

    // RMS: root mean square (volume) - range depends on input volume
    // Meyda docs: "positive floating point number, bound only by the length and volume of the input signal"
    rms: { min: 0, max: 0.1, adaptive: true },

    // Energy: infinite integral of squared signal - range 0 to bufferSize
    // Meyda docs: "0 - bufferSize, where 0.0 is very quiet and bufferSize is very loud"
    energy: { min: 0, max: 512, adaptive: true },

    // ZCR: zero crossing rate - fixed range
    // Meyda docs: "0 - ((buffer size / 2) - 1)" = 0-255 for bufferSize 512
    zcr: { min: 0, max: 255, adaptive: false },

    // === Spectral features ===

    // Spectral Centroid: brightness indicator - 0 to FFT/2
    // Meyda docs: "0 - half of the FFT size" = 0-256 for bufferSize 512
    spectralCentroid: { min: 0, max: 256, adaptive: false },

    // Spectral Flatness: how noisy a sound is
    // Meyda docs: "0.0 - 1.0 where 0.0 is not flat and 1.0 is very flat"
    spectralFlatness: { min: 0, max: 1, adaptive: false },

    // Spectral Flux: how quickly spectrum is changing - no upper limit
    // Meyda docs: "Starts at 0.0. This has no upper range as it depends on the input signal"
    spectralFlux: { min: 0, max: 1, adaptive: true },

    // Spectral Slope: how inclined the spectrum shape is
    // Meyda docs: "0.0 - 1.0"
    spectralSlope: { min: 0, max: 1, adaptive: false },

    // Spectral Rolloff: frequency containing 99% of energy - 0 to sampleRate/2
    // Meyda docs: "0 - half of the sampling rate" = 0-22050 for 44100Hz
    spectralRolloff: { min: 0, max: 22050, adaptive: false },

    // Spectral Spread: frequency bandwidth indicator
    // Meyda docs: "0 - half of the FFT size" = 0-256
    spectralSpread: { min: 0, max: 256, adaptive: false },

    // Spectral Kurtosis: how pointy/tonal the spectrum is
    // Meyda docs: "0.0 - 1.0, where 0.0 is not tonal, and 1.0 is very tonal"
    spectralKurtosis: { min: 0, max: 1, adaptive: false },

    // === Perceptual features ===

    // Perceptual Spread: how "rich/full" a sound is perceived
    // Meyda docs: "0.0 - 1.0 where 0.0 is not rich and 1.0 is very rich"
    perceptualSpread: { min: 0, max: 1, adaptive: false },

    // Perceptual Sharpness: perceived sharpness based on Bark scale
    // Meyda docs: "0.0 - 1.0 where 0.0 is not sharp and 1.0 very sharp"
    perceptualSharpness: { min: 0, max: 1, adaptive: false },

    // Loudness (total): sum of Bark band energies - not normalized
    // Meyda docs: "we leave normalization of this feature to the consumer"
    loudness: { min: 0, max: 100, adaptive: true },

    // === Derived/Custom features ===

    // Dynamic: energy change between frames (can be negative) - custom
    dynamic: { min: -0.5, max: 0.5, adaptive: true },

    // Rhythm: absolute dynamic scaled - custom
    rhythm: { min: 0, max: 0.01, adaptive: true },

    // Frequency bands - summed amplitude values from amplitudeSpectrum
    bands: {
        sub: { min: 0, max: 0.1, adaptive: true },      // 20-60 Hz
        bass: { min: 0, max: 0.1, adaptive: true },     // 60-150 Hz
        lowMid: { min: 0, max: 0.1, adaptive: true },   // 150-400 Hz
        mid: { min: 0, max: 0.1, adaptive: true },      // 400-2500 Hz
        high: { min: 0, max: 0.1, adaptive: true },     // 2500-6000 Hz
        air: { min: 0, max: 0.05, adaptive: true }      // 6000-20000 Hz
    },

    // Transients - binary 0 or 1 detection - custom
    transients: {
        kick: { min: 0, max: 1, adaptive: false },
        snare: { min: 0, max: 1, adaptive: false }
    }
};

export class HydraCompiler {
    constructor(editor) {
        this.editor = editor;
    }

    /**
     * Compile Code from Nodes
     * @param {Object} options - Optional context for compilation (default: editor state)
     * @param {Map} options.nodes - Map of nodes
     * @param {Map} options.connections - Map of connections
     * @param {Object} options.globalSettings - Global settings object
     */
    compile(options = {}) {
        // Use provided options or fall back to editor state
        const nodes = options.nodes || this.editor.nodes;
        const connections = options.connections || this.editor.connections;
        const globalSettings = options.globalSettings || this.editor.globalSettings;

        // Find all Output and Render nodes
        const outputs = [];
        const renders = [];

        nodes.forEach(node => {
            if (node.type === 'out') {
                outputs.push(node);
            } else if (node.type === 'render') {
                renders.push(node);
            }
        });

        if (outputs.length === 0 && renders.length === 0) {
            return "solid(0,0,0).out()"; // Default black
        }

        // Helper to find chain of Data Math nodes connected to a Data node
        const getMathChain = (startNodeId) => {
            const chain = [];
            let currentId = startNodeId;

            // Limit iterations to prevent infinite loops (max 20 filters)
            for (let i = 0; i < 20; i++) {
                // Find connection where:
                // sourceNodeId == currentId
                // sourcePortType == 'param-out' (or assumes implicit if math node)
                // targetNode is a 'Data Math' category node

                const conn = Array.from(connections.values()).find(c =>
                    c.sourceNodeId === currentId &&
                    c.sourcePortType === 'param-out' // Connection from the output of current node
                );

                if (!conn) break; // End of chain

                const targetNode = nodes.get(conn.targetNodeId);
                if (!targetNode) break;

                // Verify it is a Data Math node
                if (targetNode.config && targetNode.config.category === 'data_math') {
                    chain.push(targetNode);
                    currentId = targetNode.id; // Advance
                } else if (targetNode.category === 'data_math') { // Handle potential diff in node structure (saved vs live)
                    chain.push(targetNode);
                    currentId = targetNode.id;
                } else {
                    break;
                }
            }
            return chain;
        };

        const ts = Date.now();
        let script = `await window.loadScript("shaders/runtime-helpers.js?v=${ts}");\nawait window.loadScript("shaders/extra-shaders-for-hydra.js?v=${ts}");\nawait window.loadScript("shaders/HydraFCS.js?v=${ts}");\nawait window.loadScript("shaders/MaximilianAscari.js?v=${ts}");\n\n`;

        // 00. Global Settings (with MIDI Clock override support)
        if (globalSettings) {
            // BPM: Use MIDI clock if available and running, otherwise fall back to global setting
            script += `// BPM with MIDI Clock sync support\n`;
            script += `Object.defineProperty(window, '_baseBpm', { value: ${globalSettings.bpm}, writable: true, configurable: true });\n`;
            script += `Object.defineProperty(window, 'bpm', {\n`;
            script += `  get: function() {\n`;
            script += `    const clock = window._midiClockState;\n`;
            script += `    if (clock && clock.activePortId && clock.bpm > 0) {\n`;
            script += `      return clock.bpm;\n`;
            script += `    }\n`;
            script += `    return window._baseBpm;\n`;
            script += `  },\n`;
            script += `  set: function(v) { window._baseBpm = v; },\n`;
            script += `  configurable: true\n`;
            script += `});\n`;
            script += `speed = ${globalSettings.speed};\n`;
        }

        // 0a. Init External Sources (s0.initImage, etc)
        nodes.forEach(node => {
            if (node.type === 'init') {
                const vals = node.currentValue || {};
                const target = vals.target ?? node.config.params.target.default;
                const type = vals.type ?? node.config.params.type.default;
                const params = vals.params || '';
                const options = vals.options || ''; // Raw code to append

                let line = '';
                const pArg = params ? `, ${params}` : '';

                if (type === 'local image') {
                    // Uses Blob URL if loaded in memory, else falls back to path with file://
                    if (vals.blobUrl) {
                        line = `s${target}.initImage("${vals.blobUrl}"${pArg})`;
                    } else {
                        const path = vals.filePath || 'placeholder.png';
                        line = `s${target}.initImage("file://${path}"${pArg})`;
                    }
                } else if (type === 'remote image') {
                    // Prefer blobUrl (pre-fetched via CORS proxy) over raw URL
                    if (vals.blobUrl) {
                        line = `s${target}.initImage("${vals.blobUrl}"${pArg})`;
                    } else {
                        // Fallback: use CORS proxy at runtime (may not always work)
                        const url = vals.url || '';
                        const corsProxyUrl = url ? `https://corsproxy.io/?${encodeURIComponent(url)}` : '';
                        line = `s${target}.initImage("${corsProxyUrl}"${pArg})`;
                    }
                } else if (type === 'local video') {
                    if (vals.blobUrl) {
                        line = `s${target}.initVideo("${vals.blobUrl}"${pArg})`;
                    } else {
                        const path = vals.filePath || 'placeholder.mp4';
                        line = `s${target}.initVideo("file://${path}"${pArg})`;
                    }
                } else if (type === 'webcam') {
                    const idx = vals.camIndex ?? 0;
                    // initCam(index, params) ? Actually initCam(index) or initCam(src)
                    // Hydra docs: s0.initCam(0)
                    line = `s${target}.initCam(${idx}${pArg})`;
                } else if (type === 'screen') {
                    line = `s${target}.initScreen(${params})`; // No extra arg usually
                }

                if (line) {
                    script += line + '\n';
                    if (options) {
                        script += options + '\n';
                    }
                }
            }
        });

        // 0a. Setup MIDI Input Listeners - Global per port (shared across all MIDI nodes)
        const midiNodes = [];
        nodes.forEach(node => {
            if (node.type === 'midi') {
                midiNodes.push(node);
            }
        });

        if (midiNodes.length > 0) {
            // Collect unique ports used by MIDI Source nodes
            const usedPorts = new Set();
            midiNodes.forEach(node => {
                // New Source Node uses 'portId' in currentValue
                const portId = node.currentValue?.portId || '';
                if (portId) usedPorts.add(portId);
            });

            // Use the helper from runtime-helpers.js
            script += `
// Setup MIDI listeners using runtime helper
window._setupMidiListeners(${JSON.stringify([...usedPorts])});
`;
        }

        // Note: _applyDataMath is now loaded from runtime-helpers.js

        // 0b. Setup Audio Analyzers for Audio nodes (using Meyda)
        const audioNodes = [];
        nodes.forEach(node => {
            if (node.type === 'audio') {
                audioNodes.push(node);
            }
        });

        if (audioNodes.length > 0) {
            // Separate microphone and file sources
            const micNodes = audioNodes.filter(n => (n.currentValue?.source || 'microphone') === 'microphone' ||
                (!n.currentValue?.type || n.currentValue?.type === 'device'));
            const fileNodes = audioNodes.filter(n => n.currentValue?.source === 'file' || n.currentValue?.type === 'file');

            // Collect unique deviceIds used by mic nodes
            const micDevices = [...new Set(
                micNodes.map(n => n.currentValue?.deviceId).filter(d => d)
            )];

            // Collect file sources
            const fileSources = fileNodes
                .filter(n => n.currentValue?.blobUrl)
                .map(n => ({ id: n.id, url: n.currentValue.blobUrl }));

            // Generate compact audio setup code using runtime helpers
            script += `
// Audio Analyzer Setup (using runtime helpers)
;(async function() {
    // Setup microphone analyzers
    const micDevices = ${JSON.stringify(micDevices)};
    for (const deviceId of micDevices) {
        await window._setupMicrophoneAnalyzer(deviceId);
    }
    
    // Setup file audio analyzers
    const fileSources = ${JSON.stringify(fileSources)};
    for (const src of fileSources) {
        await window._setupFileAnalyzer(src.id, src.url);
    }
})();
`;
        }

        // 0. Pre-compile Array Nodes (as top-level variables)
        // e.g. var node_123 = [0.1, 0.5, 1.0];
        const arrays = [];
        nodes.forEach(node => {
            if (node.type === 'array') {
                const vals = node.currentValue?.values || [0];
                let valString = `[${vals.join(', ')}]`;

                if (node.config.params) {
                    Object.keys(node.config.params).forEach(key => {
                        // Use currentValue if present, otherwise use default
                        const val = node.currentValue?.[key] ?? node.config.params[key].default;

                        // If value is valid, chain it
                        if (val !== undefined && val !== null) {
                            if (Array.isArray(val)) {
                                // For ranges, e.g. fit(0, 1)
                                valString += `.${key}(${val.join(', ')})`;
                            } else {
                                // Quote string values if needed (specifically for select types like ease)
                                let finalVal = val;
                                if (node.config.params[key].type === 'select') {
                                    finalVal = `'${val}'`;
                                }
                                valString += `.${key}(${finalVal})`;
                            }
                        }
                    });
                }

                // Check for Math Chain
                const mathChain = getMathChain(node.id);

                if (mathChain.length > 0) {
                    // If filters are present, we must wrap it in a function to handle state/processing
                    // Generate state variables for 'smooth' filters
                    mathChain.forEach((filterNode, idx) => {
                        if (filterNode.type === 'smooth') {
                            script += `var _state_${node.id}_${idx} = { history: [] };\n`;
                        }
                    });

                    let chainCode = `
                        let val = arr[Math.floor(time * ${globalSettings.speed} * 0.5) % arr.length]; // Default cycling speed 0.5?
                        // Or maybe cyclic based on speed? Hydra usually cycles arrays based on time.
                        // Actually 'arrays' in Hydra are special. If we make it a function, we must manually cycle.
                        // Standard hydra array cycling: handled by texture logic. 
                        // But here we are data nodes. 
                        // Let's assume cycling 4Hz * global speed.
                        const idx = Math.floor(time * speed * 4) % arr.length;
                        val = arr[idx >= 0 ? idx : 0];
                     `;

                    mathChain.forEach((filterNode, idx) => {
                        const type = filterNode.type;

                        // Helper to extract param code
                        const getP = (key, defaultVal) => {
                            const val = filterNode.currentValue?.[key];
                            if (val === undefined) return defaultVal;

                            // Handle 'multiple' param type
                            if (val && typeof val === 'object' && val.activeIndex !== undefined) {
                                const configParam = filterNode.config.params[key];
                                if (!configParam) return defaultVal;

                                const activeItem = configParam.items[val.activeIndex];
                                if (activeItem.item === 'nodeList') {
                                    // Node Reference
                                    if (val.value && nodes.has(val.value)) {
                                        return `window.${val.value}()`;
                                    }
                                    return defaultVal;
                                } else {
                                    // Constant
                                    return val.value ?? defaultVal;
                                }
                            }
                            // Legacy/Simple value
                            return val;
                        };

                        let paramsObjCode = "{}";
                        if (type === 'smooth') {
                            paramsObjCode = `{ size: ${getP('size', 1)} }`;
                        } else if (type === 'round') {
                            paramsObjCode = `{ decimals: ${getP('decimals', 0)} }`;
                        } else if (type === 'if_then_else') {
                            const op = filterNode.currentValue?.operator || '>';
                            paramsObjCode = `{ threshold: ${getP('threshold', 0)}, operator: "${op}", if_true: ${getP('if_true', 1)}, if_false: ${getP('if_false', 0)} }`;
                        } else if (type === 'multiply' || type === 'exp' || type === 'root') {
                            paramsObjCode = `{ amount: ${getP('amount', 1)} }`;
                        } else {
                            // Defaults/Other types (abs, negative)
                            paramsObjCode = `{ amount: ${getP('amount', 1)} }`;
                        }

                        let stateArg = 'null';
                        if (type === 'smooth') stateArg = `_state_${node.id}_${idx}`;

                        chainCode += `val = window._applyDataMath(val, '${type}', ${paramsObjCode}, ${stateArg});\n`;
                    });

                    script += `window.${node.id} = () => { 
                        const arr = ${valString}; 
                        ${chainCode}
                        return val; 
                     }\n`;

                } else {
                    // Original behavior: constant array
                    script += `window.${node.id} = ${valString}\n`;
                }
            } else if (node.type === 'lfo') {
                // LFO Compilation to Arrow Function
                // var lfo_123 = () => { ... }

                const cur = node.currentValue || {};
                const params = node.config.params;

                const freq = cur.frequency ?? params.frequency?.default ?? 1;
                const measure = cur.measure ?? params.measure?.default ?? 'hz';
                const rangeConf = params.range || {};
                const rangeArr = cur.range ?? [rangeConf.default ?? -1, rangeConf.default ?? 1];
                const min = Array.isArray(rangeArr) ? rangeArr[0] : -1;
                const max = Array.isArray(rangeArr) ? rangeArr[1] : 1;

                const curve = cur.curve ?? params.curve?.default ?? 'sine';

                // Pulse Width (0 to 1)
                const width = cur.pulse_width ?? params.pulse_width?.default ?? 0.5;

                // Function Body
                // We depend on global 'time' (hydra default).
                // Or 'bpm' if frames?

                // 1. Calculate Phase
                let phaseCalc = '';
                if (measure === 'hz') {
                    // t * freq
                    phaseCalc = `time * ${freq}`;
                } else if (measure === 'seconds') {
                    // t / seconds
                    phaseCalc = `time / ${freq}`;
                } else if (measure === 'frames') {
                    // time * (bpm/60) * freq 
                    phaseCalc = `time * (bpm / 60) * ${freq}`;
                } else if (measure === 'beats') {
                    // Phase = time * (bpm / 60) / beats
                    // e.g. freq=4 means one complete cycle every 4 beats
                    phaseCalc = `time * (bpm / 60) / ${freq}`;
                }

                // 2. Waveform Function (-1 to 1 preferably, then map)
                let waveFunc = '';
                if (curve === 'sine') {
                    waveFunc = `Math.sin(${phaseCalc} * Math.PI * 2)`;
                } else if (curve === 'square') {
                    waveFunc = `(Math.sin(${phaseCalc} * Math.PI * 2) > 0 ? 1 : -1)`;
                } else if (curve === 'sawtooth') {
                    // 2 * (t - floor(t + 0.5))
                    waveFunc = `(2 * ((${phaseCalc}) - Math.floor(${phaseCalc} + 0.5)))`;
                } else if (curve === 'triangle') {
                    // 2 * abs(2 * (t - floor(t + 0.5))) - 1
                    waveFunc = `(2 * Math.abs(2 * ((${phaseCalc}) - Math.floor(${phaseCalc} + 0.5))) - 1)`;
                } else if (curve === 'pulse') {
                    // Variable width pulse (Duty Cycle)
                    // threshold = cos(width * PI). width 0.5 -> 0.
                    waveFunc = `((Math.sin(${phaseCalc} * Math.PI * 2) > Math.cos(${width} * Math.PI)) ? 1 : -1)`;
                } else if (curve === 's&h') {
                    // Stepped random (Sample & Hold)
                    // Deterministic hash of floor(phase)
                    waveFunc = `(function(t) { 
                        const i = Math.floor(t);
                        const h = Math.sin(i) * 43758.5453;
                        const r = h - Math.floor(h);
                        return r * 2 - 1;
                     })(${phaseCalc})`;
                } else if (curve === 'random') {
                    // Smooth noise (Linear interpolation of S&H)
                    waveFunc = `(function(t) {
                        const i = Math.floor(t);
                        const f = t - i;
                        // Hash i
                        let h = Math.sin(i) * 43758.5453;
                        let r1 = h - Math.floor(h);
                        // Hash i+1
                        h = Math.sin(i + 1) * 43758.5453;
                        let r2 = h - Math.floor(h);
                        // Smoothstep interpolation
                        const u = f * f * (3 - 2 * f);
                        const res = r1 + (r2 - r1) * u;
                        return res * 2 - 1;
                     })(${phaseCalc})`;
                } else if (curve === 'sync') {
                    // BPM-synced ramp: linear 0-1 based on beat position
                    // Returns position within the beat cycle (0 to 1), mapped to -1 to 1
                    waveFunc = `(function(t) {
                        const beatPos = t - Math.floor(t);
                        return beatPos * 2 - 1;
                     })(${phaseCalc})`;
                }

                // 3. Map to Range [min, max]
                // wave is -1 to 1. 
                // norm = (wave + 1) / 2  -> 0 to 1
                // out = min + norm * (max - min)

                const funcBody = `
                    const wave = ${waveFunc};
                    const norm = (wave + 1) / 2;
                    let val = ${min} + norm * (${max} - ${min});
                `;

                // Check for Math Chain
                const mathChain = getMathChain(node.id);
                let chainCode = '';

                if (mathChain.length > 0) {
                    // Generate state variables for 'smooth' filters
                    mathChain.forEach((filterNode, idx) => {
                        if (filterNode.type === 'smooth') {
                            script += `var _state_${node.id}_${idx} = { history: [] };\n`;
                        }
                    });

                    mathChain.forEach((filterNode, idx) => {
                        const type = filterNode.type;

                        // Helper to extract param code (Duplicated for now, should be refactored)
                        const getP = (key, defaultVal) => {
                            const val = filterNode.currentValue?.[key];
                            if (val === undefined) return defaultVal;
                            if (val && typeof val === 'object' && val.activeIndex !== undefined) {
                                const configParam = filterNode.config.params[key];
                                if (!configParam) return defaultVal;
                                const activeItem = configParam.items[val.activeIndex];
                                if (activeItem.item === 'nodeList') {
                                    if (val.value && this.editor.nodes.has(val.value)) return `window.${val.value}()`;
                                    return defaultVal;
                                } else return val.value ?? defaultVal;
                            }
                            return val;
                        };

                        let paramsObjCode = "{}";
                        if (type === 'smooth') {
                            paramsObjCode = `{ size: ${getP('size', 1)} }`;
                        } else if (type === 'round') {
                            paramsObjCode = `{ decimals: ${getP('decimals', 0)} }`;
                        } else if (type === 'if_then_else') {
                            const op = filterNode.currentValue?.operator || '>';
                            paramsObjCode = `{ threshold: ${getP('threshold', 0)}, operator: "${op}", if_true: ${getP('if_true', 1)}, if_false: ${getP('if_false', 0)} }`;
                        } else {
                            paramsObjCode = `{ amount: ${getP('amount', 1)} }`;
                        }

                        let stateArg = 'null';
                        if (type === 'smooth') stateArg = `_state_${node.id}_${idx}`;

                        chainCode += `val = window._applyDataMath(val, '${type}', ${paramsObjCode}, ${stateArg});\n`;
                    });
                }

                script += `window.${node.id} = () => { ${funcBody}\n${chainCode}\nreturn val; }\n`;
            } else if (node.type === 'midi_data') {
                // MIDI Data Compilation
                // Reads from shared global state via Source Node

                const cur = node.currentValue || {};
                const params = node.config.params;

                // Find Source Node
                let portId = '';
                const sourceNodeId = cur.source; // ID of the 'midi' source node
                if (sourceNodeId && this.editor.nodes.has(sourceNodeId)) {
                    const sourceNode = this.editor.nodes.get(sourceNodeId);
                    portId = sourceNode.currentValue?.portId || '';
                }

                // If portId empty, we default to 'all' or fail gracefully?
                // Let's assume empty string means 'listen to nothing' -> 0.

                const channel = cur.channel ?? params.channel?.default ?? 'all';
                const channelKey = channel === 'all' ? 'all' : parseInt(channel) - 1;
                const track = cur.track ?? params.track?.default ?? 'note number';
                const ccNumber = cur.ccNumber ?? params.ccNumber?.default ?? 1;
                const transposeArr = cur.transpose ?? params.transpose?.default ?? [0, 1];

                const minOut = Array.isArray(transposeArr) ? transposeArr[0] : 0;
                const maxOut = Array.isArray(transposeArr) ? transposeArr[1] : 1;

                // ... state access ...

                let rawValueCode;
                let minRaw = 0;
                let maxRaw = 127; // Default MIDI range

                if (track === 'note number') {
                    rawValueCode = `state.noteNumber`;
                } else if (track === 'note velocity') {
                    rawValueCode = `state.velocity`;
                } else if (track === 'aftertouch') {
                    rawValueCode = `state.aftertouch`;
                } else if (track === 'pitch bend') {
                    rawValueCode = `state.pitchBend`;
                    minRaw = 0;
                    maxRaw = 16383; // 14-bit pitch bend
                } else if (track === 'control change') {
                    rawValueCode = `state.cc[${ccNumber}]`;
                } else if (track === 'program change') {
                    rawValueCode = `state.program`;
                } else {
                    rawValueCode = `state.noteNumber`;
                }

                // Transpose formula: outMin + ((raw - inMin) / (inMax - inMin)) * (outMax - outMin)
                const funcBody = `
                    const portState = window._midiState?.['${portId}'];
                    const state = portState?.['${channelKey}'] || { noteNumber: 0, velocity: 0, aftertouch: 0, pitchBend: 8192, cc: [], program: 0 };
                    const raw = ${rawValueCode} ?? 0;
                    const inMin = ${minRaw};
                    const inMax = ${maxRaw};
                    const outMin = ${minOut};
                    const outMax = ${maxOut};
                    const normalized = (raw - inMin) / (inMax - inMin);
                    let val = outMin + normalized * (outMax - outMin);
                `;

                // Check for Math Chain
                const mathChain = getMathChain(node.id);
                let chainCode = '';

                if (mathChain.length > 0) {
                    // Generate state variables for 'smooth' filters
                    mathChain.forEach((filterNode, idx) => {
                        if (filterNode.type === 'smooth') {
                            script += `var _state_${node.id}_${idx} = { history: [] };\n`;
                        }
                    });

                    mathChain.forEach((filterNode, idx) => {
                        const type = filterNode.type;

                        // Helper to extract param code
                        const getP = (key, defaultVal) => {
                            const val = filterNode.currentValue?.[key];
                            if (val === undefined) return defaultVal;
                            if (val && typeof val === 'object' && val.activeIndex !== undefined) {
                                const configParam = filterNode.config.params[key];
                                if (!configParam) return defaultVal;
                                const activeItem = configParam.items[val.activeIndex];
                                if (activeItem.item === 'nodeList') {
                                    if (val.value && this.editor.nodes.has(val.value)) return `window.${val.value}()`;
                                    return defaultVal;
                                } else return val.value ?? defaultVal;
                            }
                            return val;
                        };

                        let paramsObjCode = "{}";
                        if (type === 'smooth') {
                            paramsObjCode = `{ size: ${getP('size', 1)} }`;
                        } else if (type === 'round') {
                            paramsObjCode = `{ decimals: ${getP('decimals', 0)} }`;
                        } else if (type === 'if_then_else') {
                            const op = filterNode.currentValue?.operator || '>';
                            paramsObjCode = `{ threshold: ${getP('threshold', 0)}, operator: "${op}", if_true: ${getP('if_true', 1)}, if_false: ${getP('if_false', 0)} }`;
                        } else {
                            paramsObjCode = `{ amount: ${getP('amount', 1)} }`;
                        }

                        let stateArg = 'null';
                        if (type === 'smooth') stateArg = `_state_${node.id}_${idx}`;

                        chainCode += `val = window._applyDataMath(val, '${type}', ${paramsObjCode}, ${stateArg});\n`;
                    });
                }

                script += `window.${node.id} = () => { ${funcBody}\n${chainCode}\nreturn val; }\n`;
            } else if (node.type === 'audio_data') {
                // Audio Data Compilation to Arrow Function
                // Reads from state keyed by DeviceID (mic) or NodeID (file)

                const cur = node.currentValue || {};
                const params = node.config.params;

                // Resolve Source
                let sourceNodeId = cur.source;

                // Auto-fix: If no source selected OR source is not a valid node ID, default to first available audio node
                if (!sourceNodeId || !this.editor.nodes.has(sourceNodeId)) {
                    // Check for audio nodes
                    const audioNodes = Array.from(this.editor.nodes.values()).filter(n => n.type === 'audio');
                    if (audioNodes.length > 0) {
                        sourceNodeId = audioNodes[0].id;
                    }
                }

                let stateKey = ''; // The key in _audioState

                if (sourceNodeId && this.editor.nodes.has(sourceNodeId)) {
                    const src = this.editor.nodes.get(sourceNodeId);
                    const srcType = src.currentValue?.type || 'device';
                    if (srcType === 'device') {
                        stateKey = src.currentValue?.deviceId || '';
                    } else {
                        // File type -> Key is Node ID
                        stateKey = src.id;
                    }
                }

                const track = cur.track ?? params.track?.default ?? 'energy';
                const bandType = cur.bandType ?? params.bandType?.default ?? 'bass';
                const transientType = cur.transientType ?? params.transientType?.default ?? 'kick';
                const transposeArr = cur.transpose ?? params.transpose?.default ?? [0, 1];
                const useAdaptiveRange = cur.useAdaptiveRange ?? false;
                const inputRangeArr = cur.inputRange ?? params.inputRange?.default ?? [0, 1];

                const minOut = Array.isArray(transposeArr) ? transposeArr[0] : 0;
                const maxOut = Array.isArray(transposeArr) ? transposeArr[1] : 1;

                // Get range config for this track
                let rangeConfig;
                if (track === 'bands') {
                    rangeConfig = MEYDA_AUDIO_RANGES.bands[bandType] || { min: 0, max: 0.1, adaptive: true };
                } else if (track === 'transients') {
                    rangeConfig = MEYDA_AUDIO_RANGES.transients[transientType] || { min: 0, max: 1, adaptive: false };
                } else {
                    rangeConfig = MEYDA_AUDIO_RANGES[track] || { min: 0, max: 1, adaptive: true };
                }

                // Use custom input range if provided, otherwise use default from config
                let minRaw = Array.isArray(inputRangeArr) ? inputRangeArr[0] : rangeConfig.min;
                let maxRaw = Array.isArray(inputRangeArr) ? inputRangeArr[1] : rangeConfig.max;

                // Generate raw value code based on track type
                let rawValueCode;
                switch (track) {
                    // Time-domain features
                    case 'time':
                        rawValueCode = `state.time % ${rangeConfig.max}`;
                        break;
                    case 'rms':
                        rawValueCode = `state.rms || 0`;
                        break;
                    case 'energy':
                        rawValueCode = `state.energy || 0`;
                        break;
                    case 'zcr':
                        rawValueCode = `state.zcr || 0`;
                        break;

                    // Spectral features
                    case 'spectralCentroid':
                        rawValueCode = `state.spectralCentroid || 0`;
                        break;
                    case 'spectralFlatness':
                        rawValueCode = `state.spectralFlatness || 0`;
                        break;
                    case 'spectralFlux':
                        rawValueCode = `state.spectralFlux || 0`;
                        break;
                    case 'spectralSlope':
                        rawValueCode = `state.spectralSlope || 0`;
                        break;
                    case 'spectralRolloff':
                        rawValueCode = `state.spectralRolloff || 0`;
                        break;
                    case 'spectralSpread':
                        rawValueCode = `state.spectralSpread || 0`;
                        break;
                    case 'spectralKurtosis':
                        rawValueCode = `state.spectralKurtosis || 0`;
                        break;

                    // Perceptual features
                    case 'perceptualSpread':
                        rawValueCode = `state.perceptualSpread || 0`;
                        break;
                    case 'perceptualSharpness':
                        rawValueCode = `state.perceptualSharpness || 0`;
                        break;
                    case 'loudness':
                        rawValueCode = `state.loudness || 0`;
                        break;

                    // Custom/Derived features
                    case 'dynamic':
                        rawValueCode = `state.dynamic || 0`;
                        break;
                    case 'rhythm':
                        rawValueCode = `state.rhythm || 0`;
                        break;
                    case 'bands':
                        rawValueCode = `state.bands?.['${bandType}'] || 0`;
                        break;
                    case 'transients':
                        rawValueCode = `state.transients?.['${transientType}'] || 0`;
                        break;

                    default:
                        rawValueCode = `state.energy || 0`;
                }

                // Check for Math Chain
                const mathChain = getMathChain(node.id);
                let chainCode = '';

                if (mathChain.length > 0) {
                    // Generate state variables for 'smooth' filters
                    mathChain.forEach((filterNode, idx) => {
                        if (filterNode.type === 'smooth') {
                            script += `var _state_${node.id}_${idx} = { history: [] };\n`;
                        }
                    });

                    mathChain.forEach((filterNode, idx) => {
                        const type = filterNode.type;

                        // Helper to extract param code
                        const getP = (key, defaultVal) => {
                            const val = filterNode.currentValue?.[key];
                            if (val === undefined) return defaultVal;
                            if (val && typeof val === 'object' && val.activeIndex !== undefined) {
                                const configParam = filterNode.config.params[key];
                                if (!configParam) return defaultVal;
                                const activeItem = configParam.items[val.activeIndex];
                                if (activeItem.item === 'nodeList') {
                                    if (val.value && this.editor.nodes.has(val.value)) return `window.${val.value}()`;
                                    return defaultVal;
                                } else return val.value ?? defaultVal;
                            }
                            return val;
                        };

                        let paramsObjCode = "{}";
                        if (type === 'smooth') {
                            paramsObjCode = `{ size: ${getP('size', 1)} }`;
                        } else if (type === 'round') {
                            paramsObjCode = `{ decimals: ${getP('decimals', 0)} }`;
                        } else if (type === 'if_then_else') {
                            const op = filterNode.currentValue?.operator || '>';
                            paramsObjCode = `{ threshold: ${getP('threshold', 0)}, operator: "${op}", if_true: ${getP('if_true', 1)}, if_false: ${getP('if_false', 0)} }`;
                        } else {
                            paramsObjCode = `{ amount: ${getP('amount', 1)} }`;
                        }

                        let stateArg = 'null';
                        if (type === 'smooth') stateArg = `_state_${node.id}_${idx}`;

                        chainCode += `val = window._applyDataMath(val, '${type}', ${paramsObjCode}, ${stateArg});\n`;
                    });
                }

                // Build config object for the getter factory
                const nodeId = node.id;
                const getterConfig = {
                    sourceId: stateKey,
                    track: track,
                    subtrack: track === 'bands' ? bandType : (track === 'transients' ? transientType : null),
                    nodeId: nodeId,
                    defaultMin: minRaw,
                    defaultMax: maxRaw,
                    outMin: minOut,
                    outMax: maxOut,
                    useAdaptive: useAdaptiveRange && rangeConfig.adaptive
                };

                if (mathChain.length > 0) {
                    // With math chain: wrap getter in arrow function that applies chain
                    script += `window.${node.id} = (() => { const _g = window._createAudioDataGetter(${JSON.stringify(getterConfig)}); return () => { let val = _g(); ${chainCode} return val; }; })();\n`;
                } else {
                    // No math chain: use getter directly
                    script += `window.${node.id} = window._createAudioDataGetter(${JSON.stringify(getterConfig)});\n`;
                }
            }
        });

        // Compile each output chain
        outputs.forEach(outNode => {
            // Find what is connected to the input of this output node
            const source = this.findInputSource(outNode.id, 'main', connections, nodes);
            if (source) {
                const chain = this.compileNode(source, new Set(), nodes, connections);
                // Get target (o0, o1, etc) from params
                const target = outNode.currentValue?.target ?? outNode.params.target.default;
                script += `${chain}.out(o${target})\n`;
            }
        });

        // Compile each render node
        renders.forEach(renderNode => {
            // Find what 'out' node is connected to the param-in
            const outSource = this.findInputSource(renderNode.id, 'param', connections, nodes);

            if (outSource && outSource.type === 'out') {
                // Get the target from the out node
                const target = outSource.currentValue?.target ?? outSource.params.target.default;
                script += `render(o${target})\n`;
            } else {
                script += `render()\n`;
            }
        });

        return script;
    }

    compileNode(node, path = new Set(), nodes = this.editor.nodes, connections = this.editor.connections) {
        // Recursive function to build the chain string

        // 0. LEAD CHECK - Handle Terminals/Leaves immediately (avoid cycle checks)
        // These nodes break the chain recursion naturally or represent feedback

        if (node.type === 'array') {
            return node.id;
        }

        if (node.type === 'out') {
            // "out" node used as a source (e.g. in param) compiles to oX (Feedback)
            const target = node.currentValue?.target ?? node.config.params.target.default;
            return `o${target}`;
        }

        if (node.type === 'src') {
            // src node handles input from param (connected 'out' node)
            const source = this.findInputSource(node.id, 'param', connections, nodes);
            let target = 'o0';
            if (source) {
                if (source.type === 'out') {
                    target = `o${source.currentValue?.target ?? source.config.params.target.default}`;
                } else if (source.type === 'init') {
                    target = `s${source.currentValue?.target ?? source.config.params.target.default}`;
                }
            }
            return `src(${target})`;
        }

        // Cycle Detection
        if (path.has(node.id)) {
            console.warn(`[HydraCompiler] Cycle detected at node ${node.name} (${node.id})`);
            return 'solid(1,0,0)'; // Return red for error/cycle
        }
        path.add(node.id);

        let code = "";

        try {
            // 1. Get Parameters
            const args = this.compileParams(node, path, nodes, connections);

            // 2. Check Input (Left Side) - Is it a Source or a Transform/Blend?
            // Source nodes (osc, noise) start the chain.
            // Transform nodes (rotate, scale) are methods on the previous link.

            if (node.config.hasInput) {
                // It's a transform or blend.
                // We need the input source code first.
                const inputSource = this.findInputSource(node.id, 'main', connections, nodes);

                if (inputSource) {
                    // Recursion
                    const prevCode = this.compileNode(inputSource, path, nodes, connections);

                    if (node.config.hasParamInput) {
                        // Nodes with param input (blend/modulate/colcross etc) take the param input as the FIRST argument
                        // This is a texture injection, not a parameter modulation
                        const secondarySource = this.findInputSource(node.id, 'param', connections, nodes);

                        let secondaryCode = 'solid(0,0,0,0)'; // Default transparent
                        if (secondarySource) {
                            // IMPORTANT: Trace forward from the source to find the END of its chain
                            // Pass the current path to stop BEFORE hitting any node already being compiled
                            const endOfChain = this.findEndOfChain(secondarySource.id, node.id, path, connections, nodes);
                            secondaryCode = this.compileNode(endOfChain, path, nodes, connections);
                        }

                        // Hydra syntax: .blend(texture, amount) or .colcross(texture, amount)
                        const finalArgs = [secondaryCode, ...args].join(', ');
                        code = `${prevCode}.${node.type}(${finalArgs})`;

                    } else {
                        // Standard Method (rotate, scale, pixelate) where params are just values (possibly modulated inside compileParams)
                        code = `${prevCode}.${node.type}(${args.join(', ')})`;
                    }
                }
                else {
                    // Node has input but nothing connected. 
                    code = `solid(0,0,0).${node.type}(${args.join(', ')})`;
                }

            } else {
                // Generative Source Nodes (osc, noise, voronoi, shape) - src is handled above

                // Special case: Source nodes with param input (e.g. chromaGlitchSrc takes a texture)
                if (node.config.hasParamInput) {
                    const paramSource = this.findInputSource(node.id, 'param', connections, nodes);
                    if (paramSource) {
                        const endOfChain = this.findEndOfChain(paramSource.id, node.id, path, connections, nodes);
                        const paramCode = this.compileNode(endOfChain, path, nodes, connections);
                        // Inject the texture as the first argument
                        const finalArgs = [paramCode, ...args].join(', ');
                        code = `${node.type}(${finalArgs})`;
                    } else {
                        // No param connected - use default (o0 as fallback for texture sources)
                        code = `${node.type}(o0, ${args.join(', ')})`;
                    }
                } else {
                    code = `${node.type}(${args.join(', ')})`;
                }
            }

        } finally {
            path.delete(node.id);
        }

        return code;
    }

    compileParams(node, path, nodes = this.editor.nodes, connections = this.editor.connections) {
        const results = [];
        if (!node.config.params) return results;

        // For nodes with hasParamInput, the param input is handled in compileNode (as arg 0),
        // so we DO NOT modulate the first parameter here.
        // For standard nodes (rotate etc), the param input MODULATES the first parameter.

        Object.keys(node.config.params).forEach((key, index) => {
            const paramConf = node.config.params[key];
            let val = node.currentValue?.[key];

            // Resolve default if missing
            if (val === undefined) {
                if (paramConf.type === 'multiple') {
                    // Default to first item (Constant)
                    val = { activeIndex: 0, value: paramConf.items[0].default };
                } else {
                    val = paramConf.default;
                }
            }

            // Handle 'multiple' type params
            if (node.config.params[key].type === 'multiple' && val && typeof val === 'object' && val.activeIndex !== undefined) {
                const activeItem = node.config.params[key].items[val.activeIndex];
                if (activeItem.item === 'nodeList') {
                    // Node Reference: Return as arrow function
                    if (val.value) {
                        val = `${val.value}`;
                    } else {
                        val = `0`; // Fallback
                    }
                } else {
                    // Constant: Extract value
                    val = val.value;
                }
            }

            // Only modulate first param for nodes that DO NOT support param input injection (Standard nodes)
            if (index === 0 && !node.config.hasParamInput) {
                const modSource = this.findInputSource(node.id, 'param', connections, nodes);
                if (modSource) {
                    // We have a modulator! Compile it.
                    val = this.compileNode(modSource, path, nodes, connections);
                }
            }

            if (Array.isArray(val)) {
                results.push(`[${val.join(', ')}]`);
            } else {
                results.push(val);
            }
        });

        return results;
    }

    findInputSource(nodeId, inputType, connections = this.editor.connections, nodes = this.editor.nodes) {
        // inputType: 'main' (Left) or 'param' (Top)
        let portType = inputType === 'main' ? 'input' : 'param-in';

        for (const conn of connections.values()) {
            if (conn.targetNodeId === nodeId && conn.targetPortType === portType) {
                return nodes.get(conn.sourceNodeId);
            }
        }
        return null;
    }

    /**
     * Parse state object (from JSON) to Maps compatible with compiler
     */
    static parseState(state) {
        const nodes = new Map();
        const connections = new Map();

        if (state.nodes) {
            state.nodes.forEach(n => {
                // Re-attach static configuration to the node
                if (NODES_CONFIG[n.type]) {
                    n.config = NODES_CONFIG[n.type];
                } else {
                    console.warn(`[HydraCompiler] Unknown node type: ${n.type}`);
                    // Fallback to prevent crash? 
                    // Should be handled by safe access, but for now this is critical
                }
                nodes.set(n.id, n);
            });
        }
        if (state.connections) {
            state.connections.forEach(c => connections.set(c.id, c));
        }
        return { nodes, connections, globalSettings: state.globalSettings };
    }

    findEndOfChain(startNodeId, blockNodeId = null, compilePath = null, connections = this.editor.connections, nodes = this.editor.nodes) {
        // From a source node, follow MAIN OUTPUT connections to find the last node in the chain.
        // Stop at: 'out' nodes, the calling node (blockNodeId), or any node in the current compile path.
        // This prevents tracing into nodes that would cause cycle detection to trigger.

        let currentId = startNodeId;
        let visited = new Set();
        if (blockNodeId) visited.add(blockNodeId);

        while (true) {
            if (visited.has(currentId)) break;
            visited.add(currentId);

            let nextId = null;

            for (const conn of connections.values()) {
                if (conn.sourceNodeId === currentId && conn.sourcePortType === 'output') {
                    const targetNode = nodes.get(conn.targetNodeId);

                    if (!targetNode) continue;
                    if (targetNode.type === 'out') continue; // Never trace into Out
                    if (targetNode.id === blockNodeId) continue; // Never trace back to caller

                    // NEW: Stop before entering any node in the current compile path (would cause cycle)
                    if (compilePath && compilePath.has(targetNode.id)) continue;

                    nextId = targetNode.id;
                    break;
                }
            }

            if (nextId) {
                currentId = nextId;
            } else {
                break;
            }
        }

        return nodes.get(currentId);
    }
}

