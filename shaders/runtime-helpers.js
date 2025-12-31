// Runtime Helpers for Nodemaru Visual Composer
// This file contains helper functions that are loaded at runtime to reduce generated code size

// ================================
// DATA MATH HELPER
// ================================
// Handles data math operations (smooth, abs, multiply, etc.) for both scalar and array inputs
window._applyDataMath = function (val, type, params, state) {
    // Helper to calculate average of an array of numbers
    const calcAvg = (arr) => {
        if (arr.length === 0) return 0;
        return arr.reduce((a, b) => a + b, 0) / arr.length;
    };

    // Helper to safely apply math per element
    const applyOp = (v, op) => Array.isArray(v) ? v.map((el, i) => op(el, i)) : op(v, 0);

    // Resolve param (handle array broadcasting)
    const resolveParam = (p, i) => Array.isArray(p) ? p[i % p.length] : p;

    if (type === 'smooth') {
        const history = state.history;
        const paramSize = params.size !== undefined ? params.size : params;
        const size = Math.max(1, Math.round(resolveParam(paramSize, 0)));

        // Push this frame's value to history
        let itemToStore = val;
        if (Array.isArray(val)) itemToStore = [...val];

        history.push(itemToStore);

        // Trim history to size
        while (history.length > size) history.shift();

        if (history.length === 0) return 0;

        // Calculate Average
        if (typeof history[0] === 'number') {
            return calcAvg(history);
        }

        if (Array.isArray(history[0])) {
            const len = history[0].length;
            const res = new Array(len).fill(0);
            for (let i = 0; i < len; i++) {
                let sum = 0;
                let count = 0;
                for (let h = 0; h < history.length; h++) {
                    const item = history[h];
                    if (Array.isArray(item) && i < item.length) {
                        sum += item[i];
                        count++;
                    }
                }
                res[i] = count > 0 ? sum / count : 0;
            }
            return res;
        }
        return val;
    } else if (type === 'abs') {
        return applyOp(val, v => Math.abs(v));
    } else if (type === 'multiply') {
        return applyOp(val, (v, i) => v * resolveParam(params.amount, i));
    } else if (type === 'exp') {
        return applyOp(val, (v, i) => Math.pow(v, resolveParam(params.amount, i)));
    } else if (type === 'root') {
        return applyOp(val, (v, i) => {
            const amt = resolveParam(params.amount, i);
            const s = Math.sign(v);
            return s * Math.pow(Math.abs(v), 1 / amt);
        });
    } else if (type === 'negative') {
        return applyOp(val, v => -v);
    } else if (type === 'round') {
        return applyOp(val, (v, i) => {
            const dec = Math.max(0, Math.floor(resolveParam(params.decimals, i)));
            const factor = Math.pow(10, dec);
            return Math.round(v * factor) / factor;
        });
    } else if (type === 'if_then_else') {
        return applyOp(val, (v, i) => {
            const th = resolveParam(params.threshold, i);
            const op = params.operator;
            const tv = resolveParam(params.if_true, i);
            const fv = resolveParam(params.if_false, i);

            let cond = false;
            if (op === '>') cond = v > th;
            else if (op === '<') cond = v < th;
            else if (op === '>=') cond = v >= th;
            else if (op === '<=') cond = v <= th;

            return cond ? tv : fv;
        });
    }

    return val;
};

// ================================
// MIDI CLOCK STATE
// ================================
// Global state for MIDI clock sync
if (!window._midiClockState) {
    window._midiClockState = {
        activePortId: null,      // Which port is currently syncing
        bpm: 0,                  // Calculated BPM from clock (smoothed)
        rawBpm: 0,               // Raw calculated BPM (for debugging)
        beatStartTime: 0,        // Time at start of current beat measurement
        pulseInBeat: 0,          // Pulse counter within current beat (0-23)
        beatDurations: [],       // Recent beat durations for averaging
        isRunning: false,        // Whether clock is playing
        pulseCount: 0            // Total pulse count for debugging
    };
}

// ================================
// MIDI SETUP HELPER
// ================================
// Sets up MIDI listeners for specified ports
window._setupMidiListeners = function (portsToListen) {
    if (!window._midiState) window._midiState = {};
    if (!window._midiListenersSetup) window._midiListenersSetup = {};

    if (!navigator.requestMIDIAccess) {
        console.warn('Web MIDI API not supported');
        return Promise.resolve();
    }

    return navigator.requestMIDIAccess().then(access => {
        window._midiAccess = access;

        portsToListen.forEach(portId => {
            if (window._midiListenersSetup[portId]) return; // Already setup

            const input = Array.from(access.inputs.values()).find(i => i.id === portId);
            if (input) {
                window._midiListenersSetup[portId] = true;

                // Initialize state for all 16 channels + 'all'
                if (!window._midiState[portId]) {
                    window._midiState[portId] = {};
                    for (let ch = 0; ch < 16; ch++) {
                        window._midiState[portId][ch] = {
                            noteNumber: 0, velocity: 0, aftertouch: 0, pitchBend: 8192,
                            cc: new Array(128).fill(0), program: 0
                        };
                    }
                    window._midiState[portId]['all'] = {
                        noteNumber: 0, velocity: 0, aftertouch: 0, pitchBend: 8192,
                        cc: new Array(128).fill(0), program: 0
                    };
                }

                input.onmidimessage = (msg) => {
                    const [status, data1, data2] = msg.data;

                    // ================================
                    // MIDI Clock Messages (System Real-Time)
                    // ================================
                    // Only process clock if this port is the active sync source
                    if (window._midiClockState.activePortId === portId) {
                        // 0xF8 = Timing Clock (24 pulses per quarter note)
                        if (status === 0xF8) {
                            const now = performance.now();
                            const clockState = window._midiClockState;

                            clockState.pulseCount++;
                            clockState.pulseInBeat++;

                            // Every 24 pulses = 1 beat, calculate BPM
                            if (clockState.pulseInBeat >= 24) {
                                if (clockState.beatStartTime > 0) {
                                    const beatDuration = now - clockState.beatStartTime;

                                    // Sanity check: beat should be between 200ms (300 BPM) and 2000ms (30 BPM)
                                    if (beatDuration >= 200 && beatDuration <= 2000) {
                                        // Keep last 8 beat durations for averaging
                                        clockState.beatDurations.push(beatDuration);
                                        if (clockState.beatDurations.length > 8) {
                                            clockState.beatDurations.shift();
                                        }

                                        // Calculate BPM from average beat duration
                                        if (clockState.beatDurations.length >= 2) {
                                            const avgBeatDuration = clockState.beatDurations.reduce((a, b) => a + b, 0) / clockState.beatDurations.length;
                                            const newBpm = 60000 / avgBeatDuration;
                                            clockState.rawBpm = newBpm;

                                            // Round to nearest 0.5 BPM for display stability
                                            const roundedBpm = Math.round(newBpm * 2) / 2;

                                            // Only update if changed
                                            if (clockState.bpm !== roundedBpm) {
                                                clockState.bpm = roundedBpm;
                                            }
                                        }
                                    }
                                }

                                // Reset for next beat
                                clockState.beatStartTime = now;
                                clockState.pulseInBeat = 0;
                            }
                        }
                        // 0xFA = Start
                        else if (status === 0xFA) {
                            window._midiClockState.isRunning = true;
                            window._midiClockState.beatDurations = [];
                            window._midiClockState.beatStartTime = 0;
                            window._midiClockState.pulseInBeat = 0;
                            //console.log('[MIDI Clock] Start received');
                        }
                        // 0xFB = Continue
                        else if (status === 0xFB) {
                            window._midiClockState.isRunning = true;
                            //console.log('[MIDI Clock] Continue received');
                        }
                        // 0xFC = Stop
                        else if (status === 0xFC) {
                            window._midiClockState.isRunning = false;
                            //console.log('[MIDI Clock] Stop received');
                        }
                    }

                    // ================================
                    // Channel Voice Messages
                    // ================================
                    const msgChannel = status & 0x0F;
                    const msgType = status & 0xF0;

                    // Update both specific channel and 'all'
                    const targets = [window._midiState[portId][msgChannel], window._midiState[portId]['all']];

                    targets.forEach(state => {
                        if (!state) return;

                        // Note On
                        if (msgType === 0x90 && data2 > 0) {
                            state.noteNumber = data1;
                            state.velocity = data2;
                        }
                        // Note Off
                        else if (msgType === 0x80 || (msgType === 0x90 && data2 === 0)) {
                            state.noteNumber = 0;
                            state.velocity = 0;
                            state.aftertouch = 0;
                        }
                        // Polyphonic Aftertouch
                        else if (msgType === 0xA0) {
                            state.aftertouch = data2;
                        }
                        // Control Change
                        else if (msgType === 0xB0) {
                            state.cc[data1] = data2;
                        }
                        // Program Change
                        else if (msgType === 0xC0) {
                            state.program = data1;
                        }
                        // Channel Aftertouch
                        else if (msgType === 0xD0) {
                            state.aftertouch = data1;
                        }
                        // Pitch Bend (14-bit)
                        else if (msgType === 0xE0) {
                            state.pitchBend = (data2 << 7) | data1;
                        }
                    });
                };
            }
        });
    }).catch(e => console.error('MIDI Access Error:', e));
};

// ================================
// AUDIO RANGE MAPPING HELPER
// ================================
// Maps audio values from raw range to output range with optional adaptive scaling
window._mapAudioValue = function (raw, minRaw, maxRaw, minOut, maxOut, nodeId, track, useAdaptive) {
    // Adaptive range adjustment
    if (useAdaptive && window._adaptiveRanges) {
        const key = `${nodeId}_${track}`;
        if (!window._adaptiveRanges[key]) {
            window._adaptiveRanges[key] = { min: minRaw, max: maxRaw };
        }
        const adaptive = window._adaptiveRanges[key];

        // Expand range if value exceeds current bounds
        if (raw < adaptive.min) adaptive.min = raw;
        if (raw > adaptive.max) adaptive.max = raw;

        minRaw = adaptive.min;
        maxRaw = adaptive.max;
    }

    // Clamp and normalize
    const clamped = Math.max(minRaw, Math.min(raw, maxRaw));
    const range = maxRaw - minRaw;
    const normalized = range > 0 ? (clamped - minRaw) / range : 0;

    return minOut + normalized * (maxOut - minOut);
};

// ================================
// AUDIO ANALYZER HELPERS
// ================================

// Feature extractors list (shared between mic and file)
window._meydaFeatures = [
    'energy', 'rms', 'zcr', 'amplitudeSpectrum',
    'spectralCentroid', 'spectralFlatness',
    'spectralSlope', 'spectralRolloff', 'spectralSpread', 'spectralKurtosis',
    'perceptualSpread', 'perceptualSharpness', 'loudness'
];

// Initialize audio state object with all features
window._initAudioState = function () {
    return {
        time: 0, energy: 0, rms: 0, zcr: 0,
        spectralCentroid: 0, spectralFlatness: 0, spectralFlux: 0,
        spectralSlope: 0, spectralRolloff: 0, spectralSpread: 0, spectralKurtosis: 0,
        perceptualSpread: 0, perceptualSharpness: 0, loudness: 0,
        dynamic: 0, rhythm: 0,
        bands: { sub: 0, bass: 0, lowMid: 0, mid: 0, high: 0, air: 0 },
        transients: { kick: 0, snare: 0 }
    };
};

// Create Meyda callback function (shared logic between mic and file)
window._createMeydaCallback = function (stateKey, audioContext, getTime) {
    let lastEnergy = 0;
    let lastBass = 0;
    let lastHigh = 0;

    return function (features) {
        const state = window._audioState?.[stateKey];
        if (!state) return;

        const spectrum = features.amplitudeSpectrum;
        const sampleRate = audioContext.sampleRate;
        const nyquist = sampleRate / 2;

        const bandEnergy = (from, to) => {
            const fromBin = Math.floor(from / nyquist * spectrum.length);
            const toBin = Math.floor(to / nyquist * spectrum.length);
            let sum = 0;
            for (let i = fromBin; i <= toBin; i++) sum += spectrum[i] || 0;
            return sum / (toBin - fromBin + 1 || 1);
        };

        // Frequency bands
        state.bands.sub = bandEnergy(20, 60);
        state.bands.bass = bandEnergy(60, 150);
        state.bands.lowMid = bandEnergy(150, 400);
        state.bands.mid = bandEnergy(400, 2500);
        state.bands.high = bandEnergy(2500, 6000);
        state.bands.air = bandEnergy(6000, 20000);

        // Time
        state.time = getTime();

        // Time-domain features
        state.energy = features.energy || 0;
        state.rms = features.rms || 0;
        state.zcr = features.zcr || 0;

        // Spectral features
        state.spectralCentroid = features.spectralCentroid || 0;
        state.spectralFlatness = features.spectralFlatness || 0;
        state.spectralFlux = features.spectralFlux || 0;
        state.spectralSlope = features.spectralSlope || 0;
        state.spectralRolloff = features.spectralRolloff || 0;
        state.spectralSpread = features.spectralSpread || 0;
        state.spectralKurtosis = features.spectralKurtosis || 0;

        // Perceptual features
        state.perceptualSpread = features.perceptualSpread || 0;
        state.perceptualSharpness = features.perceptualSharpness || 0;
        state.loudness = features.loudness?.total || 0;

        // Derived features
        state.dynamic = features.energy - lastEnergy;
        state.rhythm = Math.abs(state.dynamic) * 10;

        // Transient detection
        state.transients.kick = (state.bands.bass - lastBass > 0.02) ? 1 : 0;
        state.transients.snare = (state.bands.high - lastHigh > 0.015) ? 1 : 0;

        lastEnergy = features.energy;
        lastBass = state.bands.bass;
        lastHigh = state.bands.high;
    };
};

// Setup microphone analyzer
window._setupMicrophoneAnalyzer = async function (deviceId) {
    if (!window._audioState) window._audioState = {};
    if (!window._audioAnalyzers) window._audioAnalyzers = {};

    if (window._audioAnalyzers[deviceId]) return; // Already setup

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn("[Runtime] User Media API not supported.");
        return;
    }

    try {
        let stream;
        try {
            // First try with exact deviceId if provided
            stream = await navigator.mediaDevices.getUserMedia({
                audio: deviceId ? { deviceId: { exact: deviceId } } : true
            });
        } catch (constraintError) {
            // If deviceId constraint fails (OverconstrainedError), fallback to any mic
            if (constraintError.name === 'OverconstrainedError' && deviceId) {
                console.warn(`[Runtime] Device ${deviceId} not found, falling back to default microphone.`);
                stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            } else {
                throw constraintError; // Re-throw other errors
            }
        }

        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);

        window._audioState[deviceId] = window._initAudioState();

        const analyzer = Meyda.createMeydaAnalyzer({
            audioContext,
            source,
            bufferSize: 512,
            featureExtractors: window._meydaFeatures,
            callback: window._createMeydaCallback(deviceId, audioContext, () => audioContext.currentTime)
        });

        analyzer.start();
        window._audioAnalyzers[deviceId] = { analyzer, context: audioContext };

    } catch (e) {
        if (e.name === 'NotAllowedError') {
            console.warn("[Runtime] Microphone access denied by user.");
        } else if (e.name === 'NotFoundError') {
            console.warn("[Runtime] No microphone found.");
        } else {
            console.error("Microphone Analyzer Setup Error:", e);
        }
    }
};

// Setup file audio analyzer
window._setupFileAnalyzer = async function (nodeId, url) {
    if (!window._audioState) window._audioState = {};
    if (!window._audioAnalyzers) window._audioAnalyzers = {};
    if (!window._audioElements) window._audioElements = {};

    // If already exists, just resume
    if (window._audioAnalyzers[nodeId]) {
        const el = window._audioElements[nodeId];
        if (el && el.paused) el.play().catch(e => console.log(e));
        const ctx = window._audioAnalyzers[nodeId].context;
        if (ctx && ctx.state === 'suspended') ctx.resume();
        return;
    }

    try {
        const audio = new Audio(url);
        audio.loop = true;
        window._audioElements[nodeId] = audio;

        await audio.play();

        const audioContext = new AudioContext();
        const source = audioContext.createMediaElementSource(audio);
        source.connect(audioContext.destination); // Hear it!

        window._audioState[nodeId] = window._initAudioState();

        const analyzer = Meyda.createMeydaAnalyzer({
            audioContext,
            source,
            bufferSize: 512,
            featureExtractors: window._meydaFeatures,
            callback: window._createMeydaCallback(nodeId, audioContext, () => audio.currentTime)
        });

        analyzer.start();
        window._audioAnalyzers[nodeId] = { analyzer, context: audioContext, audio };

    } catch (e) {
        console.error('Audio File Analyzer Setup Error for node ' + nodeId + ':', e);
    }
};

// ================================
// AUDIO DATA GETTER FACTORY
// ================================
// Creates a getter function for audio data nodes
// Returns a function that reads audio state and maps to output range
window._createAudioDataGetter = function (config) {
    const { sourceId, track, subtrack, nodeId, defaultMin, defaultMax, outMin, outMax, useAdaptive } = config;

    return function () {
        const state = window._audioState?.[sourceId] || {};
        const raw = subtrack ? (state[track]?.[subtrack] || 0) : (state[track] || 0);

        if (useAdaptive) {
            // Adaptive range mode
            if (!window._adaptiveRanges) window._adaptiveRanges = {};
            const key = `${nodeId}_${track}`;
            if (!window._adaptiveRanges[key]) {
                window._adaptiveRanges[key] = { min: defaultMin, max: defaultMax };
            }
            const range = window._adaptiveRanges[key];

            // Update range if value exceeds it
            if (raw < range.min) range.min = raw;
            if (raw > range.max) range.max = raw;

            const inMin = range.min;
            const inMax = range.max;
            const normalized = (inMax > inMin) ? (raw - inMin) / (inMax - inMin) : 0;
            return outMin + normalized * (outMax - outMin);
        } else {
            // Fixed range mode
            const clamped = Math.max(defaultMin, Math.min(raw, defaultMax));
            const normalized = (defaultMax > defaultMin) ? (clamped - defaultMin) / (defaultMax - defaultMin) : 0;
            return outMin + normalized * (outMax - outMin);
        }
    };
};

// ================================
// VALUE TRACKING HELPER
// ================================
// Tracks min/max values for data nodes during execution
window._valueTracking = {};

window._trackValue = function (nodeId, value) {
    if (!window._valueTracking[nodeId]) {
        window._valueTracking[nodeId] = { min: value, max: value, current: value };
    }
    const t = window._valueTracking[nodeId];
    t.current = value;
    if (value < t.min) t.min = value;
    if (value > t.max) t.max = value;
    return value;
};

window._getValueStats = function (nodeId) {
    return window._valueTracking[nodeId] || { min: 0, max: 0, current: 0 };
};

window._resetValueTracking = function () {
    window._valueTracking = {};
};

//console.log('Nodemaru Runtime Helpers loaded');
