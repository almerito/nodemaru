// DataNodes - Auto-generated from LibraryCallbacks.js
// Category: data

export const DataNodes = {
    'array': {
        name: 'Array',
        category: 'data',
        hasInput: false,
        hasOutput: false,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            fit: {
                type: 'range',
                default: ''
            },
            offset: {
                type: 'float',
                default: ''
            },
            fast: {
                type: 'float',
                default: '',
                min: '',
                max: ''
            },
            smooth: {
                type: 'float',
                default: '',
                min: '',
                max: ''
            },
            ease: {
                type: 'select',
                values: ['linear', 'easeInQuad', 'easeOutQuad', 'easeInOutQuad', 'easeInCubic', 'easeOutCubic', 'easeInOutCubic', 'easeInQuart', 'easeOutQuart', 'easeInOutQuart', 'easeInQuint', 'easeOutQuint', 'easeInOutQuint', 'sin'],
                default: 'linear'
            }
        }
    },
    'lfo': {
        name: 'LFO',
        category: 'data',
        hasInput: false,
        hasOutput: false,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            frequency: {
                type: 'float',
                default: 10
            },
            measure: {
                type: 'select',
                values: ['hz', 'seconds', 'frames', 'beats'],
                default: 'hz'
            },
            range: {
                type: 'range'
            },
            pulse_width: {
                type: 'float',
                default: 0.5,
                min: 0,
                max: 1
            },
            curve: {
                type: 'select',
                values: ['sine', 'square', 'sawtooth', 'triangle', 'pulse', 'random', 's&h', 'sync'],
                default: 'sine'
            }
        }
    },
    'midi_data': {
        name: 'MIDI Data',
        category: 'data',
        hasInput: false,
        hasOutput: false,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            source: {
                type: 'select',
                values: []
            },
            port: {
                type: 'select',
                values: [],
                default: ''
            },
            channel: {
                type: 'select',
                values: ['all', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'],
                default: 'all'
            },
            track: {
                type: 'select',
                values: ['note number', 'note velocity', 'aftertouch', 'pitch bend', 'control change', 'program change'],
                default: 'note number'
            },
            ccNumber: {
                type: 'int',
                default: 1,
                min: 0,
                max: 127
            },
            transpose: {
                type: 'range',
                default: [0, 1]
            },
        }
    },
    'audio_data': {
        name: 'Audio Data',
        category: 'data',
        hasInput: false,
        hasOutput: false,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            source: {
                type: 'select',
                values: []
            },
            track: {
                type: 'select',
                values: [
                    // Custom/Derived
                    'bands', 'transients', 'dynamic', 'rhythm',
                    // Time-domain
                    'time', 'rms', 'energy', 'zcr',
                    // Spectral
                    'spectralCentroid', 'spectralFlatness', 'spectralFlux',
                    'spectralSlope', 'spectralRolloff', 'spectralSpread', 'spectralKurtosis',
                    // Perceptual
                    'perceptualSpread', 'perceptualSharpness', 'loudness',
                ],
                default: 'energy'
            },
            bandType: {
                type: 'select',
                values: ['sub', 'bass', 'lowMid', 'mid', 'high', 'air'],
                default: 'bass'
            },
            transientType: {
                type: 'select',
                values: ['kick', 'snare'],
                default: 'kick'
            },
            useAdaptiveRange: {
                type: 'checkbox',
                default: false
            },
            inputRange: {
                type: 'range',
                default: [0, 1]
            },
            transpose: {
                type: 'range',
                default: [0, 1]
            },
        }
    },
};
