/**
 * Runtime Helpers for Hydra Compiler
 * These functions are available globally during Hydra execution.
 */

import { DEFAULT_ASSETS } from './hydra_utils.js';
import Meyda from 'meyda';

// Expose Meyda globally so it's available for audio analysis
window.Meyda = Meyda;

// Global state containers
window._midiState = window._midiState || {};
window._midiClockState = window._midiClockState || { activePortId: null, bpm: 0 };
window._audioState = window._audioState || {};
window._audioAnalyzers = window._audioAnalyzers || {};

/**
 * Convert linear FFT bins to logarithmically-spaced bands
 * This gives more visual space to bass frequencies (perceptually balanced)
 * @param {Float32Array} spectrum - Raw FFT amplitude spectrum
 * @param {number} numBands - Number of output bands (e.g., 64)
 * @param {number} sampleRate - Audio sample rate (e.g., 44100)
 * @returns {Float32Array} - Logarithmically distributed bands, normalized 0-1
 */
function calculateLogSpectrum(spectrum, numBands, sampleRate) {
    const nyquist = sampleRate / 2;
    const minFreq = 20;   // Lowest audible frequency
    const maxFreq = Math.min(nyquist, 20000); // Highest (capped at human hearing)

    const result = new Float32Array(numBands);
    const binWidth = nyquist / spectrum.length;

    // Calculate logarithmic frequency boundaries for each band
    const logMin = Math.log10(minFreq);
    const logMax = Math.log10(maxFreq);
    const logStep = (logMax - logMin) / numBands;

    let globalMax = 0;

    for (let i = 0; i < numBands; i++) {
        // Frequency range for this band (logarithmic)
        const freqLow = Math.pow(10, logMin + i * logStep);
        const freqHigh = Math.pow(10, logMin + (i + 1) * logStep);

        // Convert to bin indices
        const binLow = Math.max(0, Math.floor(freqLow / binWidth));
        const binHigh = Math.min(spectrum.length - 1, Math.ceil(freqHigh / binWidth));

        // Average the bins in this range
        let sum = 0;
        let count = 0;
        for (let j = binLow; j <= binHigh; j++) {
            sum += spectrum[j] || 0;
            count++;
        }

        result[i] = count > 0 ? sum / count : 0;
        if (result[i] > globalMax) globalMax = result[i];
    }

    // Normalize to 0-1
    if (globalMax > 0) {
        for (let i = 0; i < numBands; i++) {
            result[i] /= globalMax;
        }
    }

    return result;
}

/**
 * Stop all audio analyzers (called when playback stops)
 */
window._stopAllAudioAnalyzers = function () {
    for (const nodeId in window._audioAnalyzers) {
        window._stopAudioAnalyzer(nodeId);
    }
};

/**
 * Stop a specific audio analyzer
 */
window._stopAudioAnalyzer = function (nodeId) {
    const entry = window._audioAnalyzers[nodeId];
    if (entry) {
        if (entry.audio) {
            entry.audio.pause();
            entry.audio.currentTime = 0;
        }
        if (entry.analyzer) {
            entry.analyzer.stop();
        }
        if (entry.audioContext && entry.audioContext.state !== 'closed') {
            entry.audioContext.close().catch(() => { });
        }
        delete window._audioAnalyzers[nodeId];
    }
};

/**
 * Toggle audio playback (for player UI)
 */
window._toggleAudioPlayback = function (nodeId, action) {
    const entry = window._audioAnalyzers[nodeId];
    if (!entry || !entry.audio) return false;

    switch (action) {
        case 'play':
            entry.audio.play();
            return true;
        case 'pause':
            entry.audio.pause();
            return true;
        case 'stop':
            entry.audio.pause();
            entry.audio.currentTime = 0;
            return true;
    }
    return false;
};

/**
 * Check if audio is currently playing
 */
window._isAudioPlaying = function (nodeId) {
    const entry = window._audioAnalyzers[nodeId];
    return entry && entry.audio && !entry.audio.paused;
};

/**
 * Setup MIDI listeners for specified ports
 */
window._setupMidiListeners = function (portIds) {
    if (!navigator.requestMIDIAccess) {
        console.warn('[RuntimeHelpers] Web MIDI not available');
        return;
    }

    navigator.requestMIDIAccess().then(access => {
        portIds.forEach(portId => {
            if (!portId) return;

            const input = access.inputs.get(portId);
            if (!input) {
                console.warn(`[RuntimeHelpers] MIDI input not found: ${portId}`);
                return;
            }

            // Initialize state for this port
            window._midiState[portId] = window._midiState[portId] || {};
            for (let ch = 0; ch < 16; ch++) {
                window._midiState[portId][ch] = {
                    noteNumber: 0,
                    velocity: 0,
                    aftertouch: 0,
                    pitchBend: 8192,
                    cc: new Array(128).fill(0),
                    program: 0
                };
            }
            window._midiState[portId]['all'] = {
                noteNumber: 0,
                velocity: 0,
                aftertouch: 0,
                pitchBend: 8192,
                cc: new Array(128).fill(0),
                program: 0
            };

            input.onmidimessage = (e) => {
                const [status, data1, data2] = e.data;
                const channel = status & 0x0F;
                const type = status >> 4;

                const state = window._midiState[portId][channel];
                const allState = window._midiState[portId]['all'];

                switch (type) {
                    case 0x9: // Note On
                        state.noteNumber = data1;
                        state.velocity = data2;
                        allState.noteNumber = data1;
                        allState.velocity = data2;
                        break;
                    case 0x8: // Note Off
                        state.velocity = 0;
                        allState.velocity = 0;
                        break;
                    case 0xA: // Aftertouch
                        state.aftertouch = data2;
                        allState.aftertouch = data2;
                        break;
                    case 0xB: // Control Change
                        state.cc[data1] = data2;
                        allState.cc[data1] = data2;
                        break;
                    case 0xC: // Program Change
                        state.program = data1;
                        allState.program = data1;
                        break;
                    case 0xE: // Pitch Bend
                        const bend = (data2 << 7) | data1;
                        state.pitchBend = bend;
                        allState.pitchBend = bend;
                        break;
                }
            };
        });
    }).catch(err => {
        console.error('[RuntimeHelpers] MIDI access failed:', err);
    });
};

/**
 * Setup microphone audio analyzer using Meyda
 */
window._setupMicrophoneAnalyzer = async function (deviceId) {
    if (!window.Meyda) {
        console.warn('[RuntimeHelpers] Meyda not loaded');
        return;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: deviceId ? { deviceId: { exact: deviceId } } : true
        });

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);

        window._audioState[deviceId || 'default'] = {
            time: 0,
            rms: 0,
            energy: 0,
            zcr: 0,
            spectralCentroid: 0,
            spectralFlatness: 0,
            spectralFlux: 0,
            spectralSlope: 0,
            spectralRolloff: 0,
            spectralSpread: 0,
            spectralKurtosis: 0,
            perceptualSpread: 0,
            perceptualSharpness: 0,
            loudness: 0,
            dynamic: 0,
            rhythm: 0,
            bands: { sub: 0, bass: 0, lowMid: 0, mid: 0, high: 0, air: 0 },
            transients: { kick: 0, snare: 0 },
            spectrum: new Array(64).fill(0) // Default 64 bands for spectrum analyzer
        };

        const analyzer = window.Meyda.createMeydaAnalyzer({
            audioContext: audioContext,
            source: source,
            bufferSize: 512,
            featureExtractors: ['rms', 'energy', 'zcr', 'spectralCentroid', 'spectralFlatness', 'spectralSlope', 'spectralRolloff', 'spectralSpread', 'spectralKurtosis', 'perceptualSpread', 'perceptualSharpness', 'loudness', 'amplitudeSpectrum'],
            callback: (features) => {
                const state = window._audioState[deviceId || 'default'];
                state.time = audioContext.currentTime;
                state.rms = features.rms || 0;
                state.energy = features.energy || 0;
                state.zcr = features.zcr || 0;
                state.spectralCentroid = features.spectralCentroid || 0;
                state.spectralFlatness = features.spectralFlatness || 0;
                // state.spectralFlux = features.spectralFlux || 0;
                state.spectralSlope = features.spectralSlope || 0;
                state.spectralRolloff = features.spectralRolloff || 0;
                state.spectralSpread = features.spectralSpread || 0;
                state.spectralKurtosis = features.spectralKurtosis || 0;
                state.perceptualSpread = features.perceptualSpread || 0;
                state.perceptualSharpness = features.perceptualSharpness || 0;
                state.loudness = features.loudness?.total || 0;

                // Calculate bands from amplitudeSpectrum
                if (features.amplitudeSpectrum) {
                    const spectrum = features.amplitudeSpectrum;
                    const binSize = audioContext.sampleRate / 512;
                    state.bands.sub = spectrum.slice(0, Math.floor(60 / binSize)).reduce((a, b) => a + b, 0);
                    state.bands.bass = spectrum.slice(Math.floor(60 / binSize), Math.floor(150 / binSize)).reduce((a, b) => a + b, 0);
                    state.bands.lowMid = spectrum.slice(Math.floor(150 / binSize), Math.floor(400 / binSize)).reduce((a, b) => a + b, 0);
                    state.bands.mid = spectrum.slice(Math.floor(400 / binSize), Math.floor(2500 / binSize)).reduce((a, b) => a + b, 0);
                    state.bands.high = spectrum.slice(Math.floor(2500 / binSize), Math.floor(6000 / binSize)).reduce((a, b) => a + b, 0);
                    state.bands.air = spectrum.slice(Math.floor(6000 / binSize)).reduce((a, b) => a + b, 0);

                    // Store logarithmically-distributed spectrum for spectrum analyzer
                    const logSpectrum = calculateLogSpectrum(spectrum, 64, audioContext.sampleRate);
                    for (let i = 0; i < 64; i++) {
                        state.spectrum[i] = logSpectrum[i];
                    }
                }
            }
        });

        analyzer.start();
        window._audioAnalyzers[deviceId || 'default'] = { analyzer, audioContext, stream };

    } catch (err) {
        console.error('[RuntimeHelpers] Microphone setup failed:', err);
    }
};

/**
 * Setup file audio analyzer using Meyda
 */
window._setupFileAnalyzer = async function (nodeId, blobUrl) {
    if (!window.Meyda) {
        console.warn('[RuntimeHelpers] Meyda not loaded');
        return;
    }

    try {
        // Use default audio if blobUrl is empty/invalid
        const audioUrl = blobUrl && blobUrl.trim() !== '' ? blobUrl : DEFAULT_ASSETS.audio;
        const audio = new Audio();
        audio.crossOrigin = 'anonymous';
        audio.loop = true;
        audio.src = audioUrl;

        // Wait for audio to be ready before proceeding
        await new Promise((resolve, reject) => {
            audio.addEventListener('canplaythrough', resolve, { once: true });
            audio.addEventListener('error', () => {
                // Fallback to default if primary source fails
                if (!audio.src.endsWith(DEFAULT_ASSETS.audio)) {
                    console.warn(`[RuntimeHelpers] Failed to load audio. Using default.`);
                    audio.src = DEFAULT_ASSETS.audio;
                    audio.addEventListener('canplaythrough', resolve, { once: true });
                } else {
                    reject(new Error('Default audio also failed to load'));
                }
            }, { once: true });
            audio.load(); // Trigger loading
        });

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaElementSource(audio);
        source.connect(audioContext.destination);

        window._audioState[nodeId] = {
            time: 0, rms: 0, energy: 0, zcr: 0,
            spectralCentroid: 0, spectralFlatness: 0, spectralFlux: 0,
            spectralSlope: 0, spectralRolloff: 0, spectralSpread: 0,
            spectralKurtosis: 0, perceptualSpread: 0, perceptualSharpness: 0,
            loudness: 0, dynamic: 0, rhythm: 0,
            bands: { sub: 0, bass: 0, lowMid: 0, mid: 0, high: 0, air: 0 },
            transients: { kick: 0, snare: 0 },
            spectrum: new Array(64).fill(0) // 64 bands for spectrum analyzer
        };

        const analyzer = window.Meyda.createMeydaAnalyzer({
            audioContext: audioContext,
            source: source,
            bufferSize: 512,
            featureExtractors: ['rms', 'energy', 'zcr', 'spectralCentroid', 'spectralFlatness', 'spectralSlope', 'spectralRolloff', 'spectralSpread', 'spectralKurtosis', 'perceptualSpread', 'perceptualSharpness', 'loudness', 'amplitudeSpectrum'],
            callback: (features) => {
                const state = window._audioState[nodeId];
                state.time = audioContext.currentTime;
                state.rms = features.rms || 0;
                state.energy = features.energy || 0;
                state.zcr = features.zcr || 0;
                state.spectralCentroid = features.spectralCentroid || 0;
                state.spectralFlatness = features.spectralFlatness || 0;
                state.spectralSlope = features.spectralSlope || 0;
                state.spectralRolloff = features.spectralRolloff || 0;
                state.spectralSpread = features.spectralSpread || 0;
                state.spectralKurtosis = features.spectralKurtosis || 0;
                state.perceptualSpread = features.perceptualSpread || 0;
                state.perceptualSharpness = features.perceptualSharpness || 0;
                state.loudness = features.loudness?.total || 0;

                // Calculate bands from amplitudeSpectrum
                if (features.amplitudeSpectrum) {
                    const spectrum = features.amplitudeSpectrum;
                    const binSize = audioContext.sampleRate / 512;
                    state.bands.sub = spectrum.slice(0, Math.floor(60 / binSize)).reduce((a, b) => a + b, 0);
                    state.bands.bass = spectrum.slice(Math.floor(60 / binSize), Math.floor(150 / binSize)).reduce((a, b) => a + b, 0);
                    state.bands.lowMid = spectrum.slice(Math.floor(150 / binSize), Math.floor(400 / binSize)).reduce((a, b) => a + b, 0);
                    state.bands.mid = spectrum.slice(Math.floor(400 / binSize), Math.floor(2500 / binSize)).reduce((a, b) => a + b, 0);
                    state.bands.high = spectrum.slice(Math.floor(2500 / binSize), Math.floor(6000 / binSize)).reduce((a, b) => a + b, 0);
                    state.bands.air = spectrum.slice(Math.floor(6000 / binSize)).reduce((a, b) => a + b, 0);

                    // Simple transient detection based on energy changes
                    state.transients.kick = state.bands.sub + state.bands.bass;
                    state.transients.snare = state.bands.mid + state.bands.high;

                    // Store logarithmically-distributed spectrum for spectrum analyzer
                    const logSpectrum = calculateLogSpectrum(spectrum, 64, audioContext.sampleRate);
                    for (let i = 0; i < 64; i++) {
                        state.spectrum[i] = logSpectrum[i];
                    }
                }
            }
        });

        analyzer.start();

        // Helper to get human-readable node name
        const getNodeName = (id) => {
            if (window.graph && window.graph.nodes) {
                const node = window.graph.nodes.get(id);
                if (node) {
                    const nodeIndex = node.nodeIndex ?? node.data?.nodeIndex ?? id.slice(0, 8);
                    const nodeLabel = node.data?.shaderData?.label || 'Audio';
                    return `#${nodeIndex} - ${nodeLabel}`;
                }
            }
            return id.slice(0, 8) + '...';
        };

        const nodeName = getNodeName(nodeId);

        // Handle potential audio load errors gracefully with fallback
        audio.onerror = () => {
            // Fallback to default if not already using it
            if (!audio.src.endsWith(DEFAULT_ASSETS.audio)) {
                console.warn(`[RuntimeHelpers] Failed to load audio for "${nodeName}". Using default.`);
                audio.src = DEFAULT_ASSETS.audio;
                return;
            }

            const msg = `Audio file could not be loaded for "${nodeName}". Please re-select the file.`;
            console.warn('[RuntimeHelpers]', msg);
            if (window.toastr) {
                window.toastr.warning(msg, 'Audio Load Error', { timeOut: 5000, preventDuplicates: true });
            }
        };

        try {
            // Check global flag for silent start (recording pre-roll)
            if (window._muteAudioOnStart) {
                audio.volume = 0;
            }
            await audio.play();
        } catch (playErr) {
            const msg = `Audio playback failed for "${nodeName}". The file may be missing or invalid.`;
            console.warn('[RuntimeHelpers]', msg, playErr);
            if (window.toastr) {
                window.toastr.warning(msg, 'Audio Playback Error', { timeOut: 5000, preventDuplicates: true });
            }
        }

        window._audioAnalyzers[nodeId] = { analyzer, audioContext, source, audio };

    } catch (err) {
        console.error('[RuntimeHelpers] File analyzer setup failed:', err);
    }
};

/**
 * Apply data math transformation
 */
window._applyDataMath = function (val, type, params, state) {
    switch (type) {
        case 'abs':
            return Math.abs(val);
        case 'negative':
            return -val;
        case 'multiply':
            return val * (params.amount || 1);
        case 'exp':
            return Math.pow(val, params.amount || 1);
        case 'root':
            return Math.pow(val, 1 / (params.amount || 1));
        case 'round':
            const factor = Math.pow(10, params.decimals || 0);
            return Math.round(val * factor) / factor;
        case 'smooth':
            if (!state) return val;
            state.history = state.history || [];
            state.history.push(val);
            const size = params.size || 5;
            if (state.history.length > size) state.history.shift();
            return state.history.reduce((a, b) => a + b, 0) / state.history.length;
        case 'if_then_else':
            const threshold = params.threshold ?? 0;
            const op = params.operator || '>';
            let condition = false;
            if (op === '>') condition = val > threshold;
            else if (op === '<') condition = val < threshold;
            else if (op === '>=') condition = val >= threshold;
            else if (op === '<=') condition = val <= threshold;
            else if (op === '==') condition = val === threshold;
            else if (op === '!=') condition = val !== threshold;
            return condition ? (params.if_true ?? 1) : (params.if_false ?? 0);
        default:
            return val;
    }
};

/**
 * Create audio data getter with optional adaptive range
 */
window._createAudioDataGetter = function (config) {
    const { sourceId, track, subtrack, outMin, outMax, defaultMin, defaultMax, useAdaptive, numBands } = config;

    // Adaptive range state
    let currentMin = defaultMin;
    let currentMax = defaultMax;

    return function () {
        const state = window._audioState[sourceId];
        if (!state) return track === 'spectrum' ? [] : outMin;

        // SPECTRUM TRACK: Return array with adaptive range and transpose support
        if (track === 'spectrum') {
            const spectrum = state.spectrum || [];
            const requestedBands = numBands || 64;

            // Get the spectrum values (reduce if needed)
            let values;
            if (requestedBands < spectrum.length) {
                values = [];
                const binsPerBand = Math.floor(spectrum.length / requestedBands);
                for (let i = 0; i < requestedBands; i++) {
                    let sum = 0;
                    for (let j = 0; j < binsPerBand; j++) {
                        sum += spectrum[i * binsPerBand + j] || 0;
                    }
                    values.push(sum / binsPerBand);
                }
            } else {
                values = [...spectrum]; // Copy array
            }

            // ADAPTIVE RANGE: Track min/max across all values over time
            if (useAdaptive) {
                for (let i = 0; i < values.length; i++) {
                    if (values[i] < currentMin) currentMin = values[i];
                    if (values[i] > currentMax) currentMax = values[i];
                }
            }

            // Normalize and transpose all values
            const range = currentMax - currentMin;
            if (range <= 0) {
                // No range yet, return zeros or outMin
                return values.map(() => outMin);
            }

            return values.map(v => {
                const normalized = (v - currentMin) / range;
                return outMin + normalized * (outMax - outMin);
            });
        }

        let raw;
        if (track === 'bands') {
            raw = state.bands?.[subtrack] || 0;
        } else if (track === 'transients') {
            raw = state.transients?.[subtrack] || 0;
        } else {
            raw = state[track] || 0;
        }

        // Adaptive range adjustment
        if (useAdaptive) {
            if (raw < currentMin) currentMin = raw;
            if (raw > currentMax) currentMax = raw;
        }

        // Normalize and map to output range
        const range = currentMax - currentMin;
        if (range <= 0) return outMin;

        const normalized = (raw - currentMin) / range;
        return outMin + normalized * (outMax - outMin);
    };
};