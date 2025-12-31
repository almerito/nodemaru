// BlendNodes - Auto-generated from LibraryCallbacks.js
// Category: blend

export const BlendNodes = {
    'add': {
        name: 'Add',
        category: 'blend',
        hasInput: true,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: false,
        acceptParams: ['source', 'src', 'out'],
        params: {
            amount: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1,
                    min: 0,
                    max: 1
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
            }
        }
    },
    'sub': {
        name: 'Subtract',
        category: 'blend',
        hasInput: true,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: false,
        acceptParams: ['source', 'src', 'out'],
        params: {
            amount: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1,
                    min: 0,
                    max: 1
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
            }
        }
    },
    'layer': {
        name: 'Layer',
        category: 'blend',
        hasInput: true,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: false,
        acceptParams: ['source', 'src', 'out'],
        params: {}
    },
    'blend': {
        name: 'Blend',
        category: 'blend',
        hasInput: true,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: false,
        acceptParams: ['source', 'src', 'out'],
        params: {
            amount: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.5,
                    min: 0,
                    max: 1
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
            }
        }
    },
    'mult': {
        name: 'Multiply',
        category: 'blend',
        hasInput: true,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: false,
        acceptParams: ['source', 'src', 'out'],
        params: {
            amount: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1,
                    min: 0,
                    max: 1
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
            }
        }
    },
    'diff': {
        name: 'Difference',
        category: 'blend',
        hasInput: true,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: false,
        acceptParams: ['source', 'src', 'out'],
        params: {}
    },
    'mask': {
        name: 'Mask',
        category: 'blend',
        hasInput: true,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: false,
        acceptParams: ['source', 'src', 'out'],
        params: {}
    },
    'maskInv': {
        name: 'Mask Inverse',
        category: 'blend',
        hasInput: true,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: false,
        acceptParams: ['source', 'src', 'out'],
        params: {
            threshold: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.5,
                    min: 0,
                    max: 1
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
            tolerance: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.04,
                    min: 0,
                    max: 1
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
            }
        }
    },
    'colcross': {
        name: 'Color Cross',
        category: 'blend',
        hasInput: true,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: false,
        acceptParams: ['source', 'src', 'out'],
        params: {
            amount: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0,
                    max: 1
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
            }
        }
    },
    'coldot': {
        name: 'Color Dot',
        category: 'blend',
        hasInput: true,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: false,
        acceptParams: ['source', 'src', 'out'],
        params: {
            amount: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0,
                    max: 1
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
            }
        }
    },
    'colboost': {
        name: 'Color Boost',
        category: 'blend',
        hasInput: true,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: false,
        acceptParams: ['source', 'src', 'out'],
        params: {
            amount: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0,
                    max: 1
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
            }
        }
    },
    'colreflect': {
        name: 'Color Reflect',
        category: 'blend',
        hasInput: true,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: false,
        acceptParams: ['source', 'src', 'out'],
        params: {
            amount: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0,
                    max: 1
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
            }
        }
    },
    /* 'ifpos': {
        name: 'If Positive',
        category: 'blend',
        hasInput: true, hasOutput: true,
        hasParamInput: true, hasParamOutput: false,
        params: {
            value: { type: 'multiple', items: [{ item: 'constant', type: 'text', default: 1.0, min: -1, max: 1 }, { item: 'nodeList', type: 'array' }, { item: 'nodeList', type: 'lfo' }, { item: 'nodeList', type: 'midi' }, { item: 'nodeList', type: 'audio_data' }], }
        }
    },
,
    'ifeven': {
        name: 'If Even',
        category: 'blend',
        hasInput: true, hasOutput: true,
        hasParamInput: true, hasParamOutput: false,
        params: {
            value: { type: 'multiple', items: [{ item: 'constant', type: 'text', default: 0.0, min: 0, max: 10 }, { item: 'nodeList', type: 'array' }, { item: 'nodeList', type: 'lfo' }, { item: 'nodeList', type: 'midi' }, { item: 'nodeList', type: 'audio_data' }], },
            eps: { type: 'multiple', items: [{ item: 'constant', type: 'text', default: 0.01, min: 0, max: 0.1 }, { item: 'nodeList', type: 'array' }, { item: 'nodeList', type: 'lfo' }, { item: 'nodeList', type: 'midi' }, { item: 'nodeList', type: 'audio_data' }], }
        }
    },
,
    'ifzero': {
        name: 'If Zero',
        category: 'blend',
        hasInput: true, hasOutput: true,
        hasParamInput: true, hasParamOutput: false,
        params: {
            value: { type: 'multiple', items: [{ item: 'constant', type: 'text', default: 0.0, min: -1, max: 1 }, { item: 'nodeList', type: 'array' }, { item: 'nodeList', type: 'lfo' }, { item: 'nodeList', type: 'midi' }, { item: 'nodeList', type: 'audio_data' }], },
            eps: { type: 'multiple', items: [{ item: 'constant', type: 'text', default: 0.1, min: 0, max: 1 }, { item: 'nodeList', type: 'array' }, { item: 'nodeList', type: 'lfo' }, { item: 'nodeList', type: 'midi' }, { item: 'nodeList', type: 'audio_data' }], }
        }
    },
,
    'splitview': {
        name: 'Split View (V)',
        category: 'blend',
        hasInput: true, hasOutput: true,
        hasParamInput: true, hasParamOutput: false,
        params: {
            where: { type: 'multiple', items: [{ item: 'constant', type: 'text', default: 0.5, min: 0, max: 1 }, { item: 'nodeList', type: 'array' }, { item: 'nodeList', type: 'lfo' }, { item: 'nodeList', type: 'midi' }, { item: 'nodeList', type: 'audio_data' }], }
        }
    },
,
    'splitviewh': {
        name: 'Split View (H)',
        category: 'blend',
        hasInput: true, hasOutput: true,
        hasParamInput: true, hasParamOutput: false,
        params: {
            where: { type: 'multiple', items: [{ item: 'constant', type: 'text', default: 0.5, min: 0, max: 1 }, { item: 'nodeList', type: 'array' }, { item: 'nodeList', type: 'lfo' }, { item: 'nodeList', type: 'midi' }, { item: 'nodeList', type: 'audio_data' }], }
        }
    } */

    // --- MaximilianAscari Modulate Nodes ---
};
