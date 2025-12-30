// DataMathNodes - Auto-generated from LibraryCallbacks.js
// Category: data_math

export const DataMathNodes = {
    'smooth': {
        name: 'Smooth',
        category: 'data_math',
        hasInput: false,
        hasOutput: false,
        hasParamInput: true,
        hasParamOutput: true,
        acceptParams: ['data_math', 'array', 'audio_data', 'lfo', 'midi_data'],
        params: {
            size: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0,
                    max: 10
                }, {
                    item: 'nodeList',
                    type: 'array'
                }, {
                    item: 'nodeList',
                    type: 'lfo'
                }, {
                    item: 'nodeList',
                    type: 'midi_data'
                }, {
                    item: 'nodeList',
                    type: 'audio_data'
                }]
            },
        }
    },
    'abs': {
        name: 'Absolute',
        category: 'data_math',
        hasInput: false,
        hasOutput: false,
        hasParamInput: true,
        hasParamOutput: true,
        acceptParams: ['data_math', 'array', 'audio_data', 'lfo', 'midi_data'],
        params: {}
    },
    'multiply': {
        name: 'Multiply',
        category: 'data_math',
        hasInput: false,
        hasOutput: false,
        hasParamInput: true,
        hasParamOutput: true,
        acceptParams: ['data_math', 'array', 'audio_data', 'lfo', 'midi_data'],
        params: {
            amount: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0,
                    max: 10
                }, {
                    item: 'nodeList',
                    type: 'array'
                }, {
                    item: 'nodeList',
                    type: 'lfo'
                }, {
                    item: 'nodeList',
                    type: 'midi_data'
                }, {
                    item: 'nodeList',
                    type: 'audio_data'
                }]
            },
        }
    },
    'exp': {
        name: 'Exponential',
        category: 'data_math',
        hasInput: false,
        hasOutput: false,
        hasParamInput: true,
        hasParamOutput: true,
        acceptParams: ['data_math', 'array', 'audio_data', 'lfo', 'midi_data'],
        params: {
            amount: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0,
                    max: 10
                }, {
                    item: 'nodeList',
                    type: 'array'
                }, {
                    item: 'nodeList',
                    type: 'lfo'
                }, {
                    item: 'nodeList',
                    type: 'midi_data'
                }, {
                    item: 'nodeList',
                    type: 'audio_data'
                }]
            },
        }
    },
    'root': {
        name: 'Root',
        category: 'data_math',
        hasInput: false,
        hasOutput: false,
        hasParamInput: true,
        hasParamOutput: true,
        acceptParams: ['data_math', 'array', 'audio_data', 'lfo', 'midi_data'],
        params: {
            amount: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0,
                    max: 10
                }, {
                    item: 'nodeList',
                    type: 'array'
                }, {
                    item: 'nodeList',
                    type: 'lfo'
                }, {
                    item: 'nodeList',
                    type: 'midi_data'
                }, {
                    item: 'nodeList',
                    type: 'audio_data'
                }]
            },
        }
    },
    'round': {
        name: 'Round',
        category: 'data_math',
        hasInput: false,
        hasOutput: false,
        hasParamInput: true,
        hasParamOutput: true,
        acceptParams: ['data_math', 'array', 'audio_data', 'lfo', 'midi_data'],
        params: {
            decimals: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0,
                    max: 10
                }, {
                    item: 'nodeList',
                    type: 'array'
                }, {
                    item: 'nodeList',
                    type: 'lfo'
                }, {
                    item: 'nodeList',
                    type: 'midi_data'
                }, {
                    item: 'nodeList',
                    type: 'audio_data'
                }]
            },
        }
    },
    'if_then_else': {
        name: 'If Then Else',
        category: 'data_math',
        hasInput: false,
        hasOutput: false,
        hasParamInput: true,
        hasParamOutput: true,
        acceptParams: ['data_math', 'array', 'audio_data', 'lfo', 'midi_data'],
        params: {
            threshold: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0,
                    max: 10
                }, {
                    item: 'nodeList',
                    type: 'array'
                }, {
                    item: 'nodeList',
                    type: 'lfo'
                }, {
                    item: 'nodeList',
                    type: 'midi_data'
                }, {
                    item: 'nodeList',
                    type: 'audio_data'
                }]
            },
            operator: {
                type: 'select',
                values: ['>', '<', '>=', '<='],
                default: '>'
            },
            if_true: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0,
                    max: 10
                }, {
                    item: 'nodeList',
                    type: 'array'
                }, {
                    item: 'nodeList',
                    type: 'lfo'
                }, {
                    item: 'nodeList',
                    type: 'midi_data'
                }, {
                    item: 'nodeList',
                    type: 'audio_data'
                }]
            },
            if_false: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0,
                    max: 10
                }, {
                    item: 'nodeList',
                    type: 'array'
                }, {
                    item: 'nodeList',
                    type: 'lfo'
                }, {
                    item: 'nodeList',
                    type: 'midi_data'
                }, {
                    item: 'nodeList',
                    type: 'audio_data'
                }]
            },
        }
    },
    // --- OUTPUT ---
};
