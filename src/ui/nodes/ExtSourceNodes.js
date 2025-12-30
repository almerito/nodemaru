// ExtSourceNodes - Auto-generated from LibraryCallbacks.js
// Category: ext_source

export const ExtSourceNodes = {
    'audio': {
        name: 'Audio Input',
        category: 'ext_source',
        hasInput: false,
        hasOutput: false,
        hasParamInput: false,
        hasParamOutput: false,
        params: {
            type: {
                type: 'select',
                values: ['device', 'file'],
                default: 'device'
            },
            port: {
                type: 'select',
                values: [],
                default: ''
            },
        }
    },
    'midi': {
        name: 'MIDI Input',
        category: 'ext_source',
        hasInput: false,
        hasOutput: false,
        hasParamInput: false,
        hasParamOutput: false,
        params: {
            port: {
                type: 'select',
                values: [],
                default: ''
            },
        }
    },
    'init': {
        name: 'Ext. Source',
        category: 'ext_source',
        hasInput: false,
        hasOutput: false,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            target: {
                type: 'int',
                default: 0,
                min: 0,
                max: 3,
                unique: true
            },
            type: {
                type: 'select',
                values: ['local image', 'remote image', 'local video', 'webcam', 'screen'],
                default: 'local image'
            },
            params: {
                type: 'textarea',
                default: ''
            },
            options: {
                type: 'textarea',
                default: ''
            }
        }
    },
    'src': {
        name: 'Source Input',
        category: 'ext_source',
        hasInput: false,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: true,
        acceptParams: ['out', 'init', 'src'],
        params: {}
    },

    // --- Geometry (NO param output - only main output) ---
};
