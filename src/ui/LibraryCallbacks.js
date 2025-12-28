export const CATEGORY_LABELS = {
    source: 'Source',
    ext_source: 'Ext. Source',
    geometry: 'Geometry',
    color: 'Color',
    blend: 'Blend',
    modulate: 'Modulate',
    data: 'Data',
    data_math: 'Data Math',
    output: 'Output'
};

// Subcategory labels - used for second-level tabs within each category
// Nodes without a subcategory will appear in 'General' tab
export const SUBCATEGORY_LABELS = {
    // Source subcategories
    shapes: 'Shapes',
    oscillators: 'Oscillators',
    noises: 'Noises',
    colored: 'Colored',
    radial: 'Radial',
    fcs: 'FCS Curves',
    patterns: 'Patterns',
    complex: 'Complex',

    // Geometry subcategories
    transform: 'Transform',
    repeat: 'Repeat',
    distort: 'Distort',

    // Color subcategories
    adjust: 'Adjust',
    effect: 'Effect',
    source_input: 'Source Input',

    // Effect subcategories (for future p5.js integration)
    particles: 'Particles',
    lines: 'Lines',

    // Generic
    extra: 'Extra'
};

export const NODES_CONFIG = {
    // --- Source (have param output for modulation) ---
    // complex
    'toriiLogo': {
        name: 'Nodemaru',
        category: 'source',
        subcategory: 'complex',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            scale: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
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
            grainDensity: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 10.0,
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
            flowSpeed: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.1,
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
            roughness: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.5,
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
    'fractal3d': {
        name: '3D Fractal',
        category: 'source',
        subcategory: 'complex',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            speed: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0,
                    max: 5
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
            zoom: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0.1,
                    max: 3
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
            detail: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 3.0,
                    min: 1,
                    max: 20
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
    'tunnel3d': {
        name: '3D Tunnel',
        category: 'source',
        subcategory: 'complex',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            speed: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0,
                    max: 3
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
            scale: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 2.0,
                    min: 0.5,
                    max: 5
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
            depth: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 3.0,
                    min: 1,
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
            }
        }
    },
    'fractalPyramid': {
        name: 'Fractal Pyramid',
        category: 'source',
        subcategory: 'complex',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            speed: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0,
                    max: 3
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
            zoom: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0.5,
                    max: 3
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
            colorMix: {
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
    'lowTechTunnel': {
        name: 'Low Tech Tunnel',
        category: 'source',
        subcategory: 'complex',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            speed: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0,
                    max: 3
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
            radius: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 2.0,
                    min: 0.5,
                    max: 5
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
            detail: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0,
                    max: 3
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
    'octgrams': {
        name: 'Octgrams',
        category: 'source',
        subcategory: 'complex',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            speed: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0,
                    max: 3
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
            zoom: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.5,
                    min: 0.5,
                    max: 3
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
            brightness: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0.1,
                    max: 3
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
    'neonLines': {
        name: 'Neon Lines',
        category: 'source',
        subcategory: 'complex',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            speed: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0,
                    max: 3
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
            lines: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 10.0,
                    min: 1,
                    max: 20
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
            hue: {
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
    'shape': {
        name: 'Shape',
        category: 'source',
        subcategory: 'shapes',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            sides: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 3,
                    min: 3,
                    max: 20
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
            radius: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.3,
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
            smoothing: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.01,
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
    'shapeOutline': {
        name: 'Shape Outline',
        category: 'source',
        subcategory: 'shapes',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            sides: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 3,
                    min: 3,
                    max: 20
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
            radius: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.3,
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
            width: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.02,
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
            smoothing: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.01,
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
    'spiral': {
        name: 'Spiral',
        category: 'source',
        subcategory: 'shapes',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            a: {
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
            b: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 5.0,
                    min: 0,
                    max: 20
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
            thickness: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.1,
                    min: 0.01,
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
    'wave': {
        name: 'Extra Wave',
        category: 'source',
        subcategory: 'shapes',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            time: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.0,
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
            frequ: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 10.0,
                    min: 1,
                    max: 100
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
            loops: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 3.0,
                    min: 1,
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
            thick: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.025,
                    min: 0.001,
                    max: 0.2
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
    'lissa': {
        name: 'Lissajous',
        category: 'source',
        subcategory: 'shapes',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            time: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.0,
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
            frequ: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 10.0,
                    min: 1,
                    max: 100
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
            loops: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 3.0,
                    min: 1,
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
            thick: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.025,
                    min: 0.001,
                    max: 0.2
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
    'forestLight': {
        name: 'Forest Light',
        category: 'source',
        subcategory: 'complex',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            posX: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.25,
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
            posY: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.1,
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
            density: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.5,
                    min: 0,
                    max: 5
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
            speed: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.2,
                    min: 0,
                    max: 5
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
            rayStrength: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.5,
                    min: 0,
                    max: 5
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
            softness: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.3,
                    min: 0,
                    max: 5
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
    'geodist': {
        name: 'Geo Distortion',
        category: 'source',
        subcategory: 'complex',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            speed: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0,
                    max: 5
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
            intensity: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0,
                    max: 3
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
            scale: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 4.0,
                    min: 1,
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
            }
        }
    },
    'fractalComplex': {
        name: 'Fractal Complex',
        category: 'source',
        subcategory: 'complex',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            speed: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0,
                    max: 3
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
            zoom: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0.1,
                    max: 2
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
            colorShift: {
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
    'fractalRing': {
        name: 'Fractal Ring',
        category: 'source',
        subcategory: 'complex',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            speed: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0,
                    max: 3
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
            zoom: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0.1,
                    max: 2
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
            complexity: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 15.0,
                    min: 3,
                    max: 30
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
    'movingBubbles': {
        name: 'Moving Bubbles',
        category: 'source',
        subcategory: 'complex',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            speed: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0,
                    max: 3
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
            density: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0.1,
                    max: 3
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
            jitter: {
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
    'trafficGrid': {
        name: 'Traffic Grid',
        category: 'source',
        subcategory: 'complex',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            speed: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0,
                    max: 3
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
            density: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0.1,
                    max: 3
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
            jitter: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.8,
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
    'squareTunnel': {
        name: 'Square Tunnel',
        category: 'source',
        subcategory: 'complex',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            speed: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0,
                    max: 3
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
            spacing: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.9,
                    min: 0.5,
                    max: 0.99
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
            rotation: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.0,
                    min: -5,
                    max: 5
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
    'icosahedron': {
        name: 'Icosahedron',
        category: 'source',
        subcategory: 'complex',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            speed: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0,
                    max: 3
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
            size: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0.1,
                    max: 3
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
            glow: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.005,
                    min: 0.001,
                    max: 0.05
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
    'kaleidoFog': {
        name: 'Kaleido Fog',
        category: 'source',
        subcategory: 'complex',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            speed: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0,
                    max: 3
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
            glow: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0,
                    max: 2
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
            distort: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 3.0,
                    min: 1,
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
            }
        }
    },

    // Oscillators
    'osc': {
        name: 'Oscillator',
        category: 'source',
        subcategory: 'oscillators',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            frequency: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 60,
                    min: 0.1,
                    max: 400
                },
                {
                    item: 'nodeList',
                    type: 'array'
                },
                {
                    item: 'nodeList',
                    type: 'lfo'
                },
                {
                    item: 'nodeList',
                    type: 'midi_data'
                },
                {
                    item: 'nodeList',
                    type: 'audio_data'
                },
                ]
            },
            sync: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.1,
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
            offset: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0,
                    min: 0,
                    max: 20
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
    'squ': {
        name: 'Square Wave',
        category: 'source',
        subcategory: 'oscillators',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            frequency: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 10.0,
                    min: 1,
                    max: 100
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
            speed: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.1,
                    min: 0,
                    max: 2
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
    'usin': {
        name: 'U-Sine',
        category: 'source',
        subcategory: 'oscillators',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            frequency: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 10.0,
                    min: 1,
                    max: 100
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
            speed: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.1,
                    min: 0,
                    max: 2
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
    'saw': {
        name: 'Sawtooth',
        category: 'source',
        subcategory: 'oscillators',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            frequency: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 10.0,
                    min: 1,
                    max: 100
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
            speed: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.1,
                    min: 0,
                    max: 2
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
    'tri': {
        name: 'Triangle',
        category: 'source',
        subcategory: 'oscillators',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            frequency: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 10.0,
                    min: 1,
                    max: 100
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
            speed: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.1,
                    min: 0,
                    max: 2
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
    'harmonic': {
        name: 'Harmonic',
        category: 'source',
        subcategory: 'oscillators',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            frequency: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 10.0,
                    min: 1,
                    max: 100
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
            speed: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.1,
                    min: 0,
                    max: 2
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
            phase1: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.0,
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
            phase2: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.0,
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
    'stripes': {
        name: 'Stripes',
        category: 'source',
        subcategory: 'oscillators',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            frequency: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 10.0,
                    min: 1,
                    max: 100
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
            speed: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0,
                    max: 5
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
    'rsqu': {
        name: 'Radial Square',
        category: 'source',
        subcategory: 'oscillators',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            frequency: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 10.0,
                    min: 1,
                    max: 100
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
            speed: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.1,
                    min: 0,
                    max: 2
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
    'rusin': {
        name: 'Radial U-Sine',
        category: 'source',
        subcategory: 'oscillators',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            frequency: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 10.0,
                    min: 1,
                    max: 100
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
            speed: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.1,
                    min: 0,
                    max: 2
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
    'rsaw': {
        name: 'Radial Saw',
        category: 'source',
        subcategory: 'oscillators',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            frequency: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 10.0,
                    min: 1,
                    max: 100
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
            speed: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.1,
                    min: 0,
                    max: 2
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
    'rtri': {
        name: 'Radial Triangle',
        category: 'source',
        subcategory: 'oscillators',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            frequency: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 10.0,
                    min: 1,
                    max: 100
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
            speed: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.1,
                    min: 0,
                    max: 2
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
    'rharmonic': {
        name: 'Radial Harmonic',
        category: 'source',
        subcategory: 'oscillators',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            frequency: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 10.0,
                    min: 1,
                    max: 100
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
            speed: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.1,
                    min: 0,
                    max: 2
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
            phase1: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.0,
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
            phase2: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.0,
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
    'rstripes': {
        name: 'Radial Stripes',
        category: 'source',
        subcategory: 'oscillators',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            frequency: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 10.0,
                    min: 1,
                    max: 100
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
            speed: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0,
                    max: 5
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
    'concentric_pattern': {
        name: 'Concentric (Pattern)',
        category: 'source',
        subcategory: 'oscillators',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            base: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 5.0,
                    min: 1,
                    max: 50
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
            octaves: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 2.0,
                    min: 1,
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
            ampscale: {
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
            speed: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0,
                    max: 5
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
    'sdfmove': {
        name: 'SDF Move',
        category: 'source',
        subcategory: 'oscillators',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            speed1: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.73,
                    min: -2,
                    max: 2
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
            speed2: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: -2,
                    max: 2
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
            speed3: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: -0.53,
                    min: -2,
                    max: 2
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
    'voronoi': {
        name: 'Voronoi',
        category: 'source',
        subcategory: 'oscillators',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            scale: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 5,
                    min: 0.1,
                    max: 100
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
            speed: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.3,
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
            blending: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.3,
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
    'triwave1': {
        name: 'TriWave 1',
        category: 'oscillators',
        subcategory: 'complex',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            speed: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0,
                    max: 3
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
            depth: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0.5,
                    max: 3
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
            brightness: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0.1,
                    max: 3
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
    'triwave2': {
        name: 'TriWave 2',
        category: 'source',
        subcategory: 'oscillators',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            speed: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0,
                    max: 3
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
            depth: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0.5,
                    max: 3
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
            intensity: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0.1,
                    max: 3
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
    'triwave3': {
        name: 'TriWave 3',
        category: 'source',
        subcategory: 'oscillators',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            speed: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0,
                    max: 3
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
            depth: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0.5,
                    max: 3
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
            contrast: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0.1,
                    max: 3
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

    // Noises
    'noise': {
        name: 'Noise',
        category: 'source',
        subcategory: 'noises',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            scale: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 10,
                    min: 0.1,
                    max: 200
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
            offset: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.1,
                    min: 0,
                    max: 20
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
    'whitenoise': {
        name: 'White Noise',
        category: 'source',
        subcategory: 'noises',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            size: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 10.0,
                    min: 1,
                    max: 100
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
            dynamic: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.0,
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
    'colornoise': {
        name: 'Color Noise',
        category: 'source',
        subcategory: 'noises',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            size: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 10.0,
                    min: 1,
                    max: 100
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
            dynamic: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.0,
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
    'unoise': {
        name: 'U-Noise',
        category: 'source',
        subcategory: 'noises',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            scale: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 10.0,
                    min: 1,
                    max: 100
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
            offset: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.1,
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
    'turb': {
        name: 'Turbulence',
        category: 'source',
        subcategory: 'noises',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            scale: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 10.0,
                    min: 1,
                    max: 100
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
            offset: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.1,
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
            octaves: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 3.0,
                    min: 1,
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
            }
        }
    },
    'uturb': {
        name: 'U-Turbulence',
        category: 'source',
        subcategory: 'noises',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            scale: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 10.0,
                    min: 1,
                    max: 100
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
            offset: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.1,
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
            octaves: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 3.0,
                    min: 1,
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
            }
        }
    },
    'warp': {
        name: 'Warp',
        category: 'source',
        subcategory: 'noises',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            scalei: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 10.0,
                    min: 1,
                    max: 100
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
            offset: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.1,
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
            octaves: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 2.0,
                    min: 1,
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
            octavesinner: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 3.0,
                    min: 1,
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
            scale: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0.1,
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
            }
        }
    },
    'cwarp': {
        name: 'Circular Warp',
        category: 'source',
        subcategory: 'noises',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            scalei: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 10.0,
                    min: 1,
                    max: 100
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
            offset: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.1,
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
            octaves: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 2.0,
                    min: 1,
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
            octavesinner: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 3.0,
                    min: 1,
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
            scale: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0.1,
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
            focus: {
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
    'ncontour': {
        name: 'Noise Contour',
        category: 'source',
        subcategory: 'noises',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            thresh: {
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
            smooth: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.1,
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
            octaves: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 3,
                    min: 1,
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
            scale: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 5.0,
                    min: 1,
                    max: 50
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
            speed: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.5,
                    min: 0,
                    max: 5
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
            step: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 2.0,
                    min: 1,
                    max: 5
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
    'smoothsun': {
        name: 'Smooth Sun',
        category: 'source',
        subcategory: 'noises',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            threshold: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.3,
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
            border: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.2,
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
            speed: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0,
                    max: 5
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
            ampscale: {
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

    // Colored
    'solid': {
        name: 'Solid',
        category: 'source',
        subcategory: 'colored',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            r: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.2,
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
            g: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.4,
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
            b: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.6,
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
            a: {
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
    'gradient': {
        name: 'Gradient',
        category: 'source',
        subcategory: 'colored',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            speed: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.5,
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
            }
        }
    },
    'pSphere': {
        name: 'pSphere',
        category: 'source',
        subcategory: 'colored',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            freq: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
            a: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
    'pMobiusStrip': {
        name: 'pMobius Strip',
        category: 'source',
        subcategory: 'colored',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            freq: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
            a: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
    'blinking': {
        name: 'Blinking',
        category: 'source',
        subcategory: 'colored',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            tiles: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 5.0,
                    min: 1,
                    max: 20
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
            scale: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 5.0,
                    min: 1,
                    max: 20
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
            speed: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.5,
                    min: 0,
                    max: 5
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
            phase: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.03,
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
    'phasenoise': {
        name: 'Phase Noise',
        category: 'source',
        subcategory: 'colored',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            base: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.0,
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
            range: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.1,
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
            scale: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 5.0,
                    min: 1,
                    max: 20
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
            speed: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.5,
                    min: 0,
                    max: 5
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
            phase: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.03,
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
    'pKleinBottle': {
        name: 'pKlein Bottle',
        category: 'source',
        subcategory: 'colored',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            freq: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
            aa: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
    'pCrossCap': {
        name: 'pCross Cap',
        category: 'source',
        subcategory: 'colored',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            freq: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
            aa: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
    'pSteiner': {
        name: 'pSteiner',
        category: 'source',
        subcategory: 'colored',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            freq: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
            aa: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
    'pTorus': {
        name: 'pTorus',
        category: 'source',
        subcategory: 'colored',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            freq: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
            a: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
            c: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.5
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
    'pCylinder': {
        name: 'pTorus',
        category: 'source',
        subcategory: 'colored',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            freq: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
            a: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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

    // Patterns
    'pulse': {
        name: 'Pulse',
        category: 'source',
        subcategory: 'patterns',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            edge: {
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
            width: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.05,
                    min: 0,
                    max: 0.5
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
            epsilon: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.001,
                    min: 0.0001,
                    max: 0.01
                }]
            }
        }
    },
    'pulsetrain': {
        name: 'Pulse Train',
        category: 'source',
        subcategory: 'patterns',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            train: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 3.0,
                    min: 1,
                    max: 20
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
            edge: {
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
            width: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.05,
                    min: 0,
                    max: 0.5
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
            epsilon: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.001,
                    min: 0.0001,
                    max: 0.01
                }]
            }
        }
    },
    'hextile': {
        name: 'Hex Tile',
        category: 'source',
        subcategory: 'patterns',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            tiles: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 10.0,
                    min: 1,
                    max: 50
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
    'checker': {
        name: 'Checker',
        category: 'source',
        subcategory: 'patterns',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            repeats: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 10.0,
                    min: 1,
                    max: 50
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
    'concentric': {
        name: 'Concentric (Rings)',
        category: 'source',
        subcategory: 'patterns',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            scale: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 100.0,
                    min: 1,
                    max: 500
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
            centerX: {
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
            centerY: {
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
    'brick': {
        name: 'Brick',
        category: 'source',
        subcategory: 'patterns',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            width: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.25,
                    min: 0.01,
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
            height: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.08,
                    min: 0.01,
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
            gap: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.01,
                    min: 0.001,
                    max: 0.1
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

    // --- HydraFCS (Implicit/Parametric Sources) ---
    'iCardioid': {
        name: 'iCardioid',
        category: 'source',
        subcategory: 'fcs',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            freq: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
            a: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
    'iBicorn': {
        name: 'iBicorn',
        category: 'source',
        subcategory: 'fcs',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            freq: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
            a_exp: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
            a: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
    'iAstroid': {
        name: 'iAstroid',
        category: 'source',
        subcategory: 'fcs',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            freq: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
            wrap: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
            amp: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
    'iCircle': {
        name: 'iCircle',
        category: 'source',
        subcategory: 'fcs',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            freq: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
    'iCassOval': {
        name: 'iCassOval',
        category: 'source',
        subcategory: 'fcs',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            freq: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
            mult: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
            a: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
            c: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
    'iSextic': {
        name: 'iSextic',
        category: 'source',
        subcategory: 'fcs',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            freq1: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
            freq2: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
            a: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
    'iCochleoid': {
        name: 'iCochleoid',
        category: 'source',
        subcategory: 'fcs',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            freq1: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
            freq2: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
            a: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
    'iCissoid': {
        name: 'iCissoid',
        category: 'source',
        subcategory: 'fcs',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            freq: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
            a: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
            wrap: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 10.0
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
    'iSluzeConchoid': {
        name: 'iSluze Conchoid',
        category: 'source',
        subcategory: 'fcs',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            freq: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
            a: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 3.0
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
            k: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
    'iDevil': {
        name: 'iDevil',
        category: 'source',
        subcategory: 'fcs',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            freq: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
            wrap: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 4.0
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
            k: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
            a: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 3.0
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
    'iDFolium': {
        name: 'iDFolium',
        category: 'source',
        subcategory: 'fcs',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            freq: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
            a: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 3.0
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
    'iSpiral': {
        name: 'iSpiral',
        category: 'source',
        subcategory: 'fcs',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            freq: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
            a: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 3.0
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
            b: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
    'iFermatSpiral': {
        name: 'iFermat Spiral',
        category: 'source',
        subcategory: 'fcs',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            freq: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
            a: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
            b: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
    'iFreethNephroid': {
        name: 'iFreet hNephroid',
        category: 'source',
        subcategory: 'fcs',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            freq1: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
            freq2: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
            a: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 2.0
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
    'iInvoluteCircle': {
        name: 'iInvolute Circle',
        category: 'source',
        subcategory: 'fcs',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            freq: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0
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
            wrap: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 10.0
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
    'blobs': {
        name: 'Blobs',
        category: 'source',
        subcategory: 'fcs',
        hasInput: false,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: true,
        params: {
            speed: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.1,
                    min: 0,
                    max: 2
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
            tresh: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.2,
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
            soft: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.05,
                    min: 0,
                    max: 0.5
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

    // --- External sources ---
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
    'rotate': {
        name: 'Rotate',
        category: 'geometry',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        params: {
            angle: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 10,
                    min: -360,
                    max: 360
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
            speed: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0,
                    min: -20,
                    max: 20
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
    'scale': {
        name: 'Scale',
        category: 'geometry',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        params: {
            amount: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.5,
                    min: 0,
                    max: 20
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
            xMult: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1,
                    min: 0,
                    max: 20
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
            yMult: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1,
                    min: 0,
                    max: 20
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
            offsetX: {
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
            offsetY: {
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
    'pixelate': {
        name: 'Pixelate',
        category: 'geometry',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        params: {
            pixelX: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 20,
                    min: 1,
                    max: 500
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
            pixelY: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 20,
                    min: 1,
                    max: 500
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
    'repeat': {
        name: 'Repeat',
        category: 'geometry',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        params: {
            repeatX: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 3,
                    min: 1,
                    max: 50
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
            repeatY: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 3,
                    min: 1,
                    max: 50
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
            offsetX: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0,
                    min: 0,
                    max: 20
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
            offsetY: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0,
                    min: 0,
                    max: 20
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
    'repeatX': {
        name: 'Repeat X',
        category: 'geometry',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        params: {
            reps: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 3,
                    min: 1,
                    max: 50
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
            offset: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0,
                    min: 0,
                    max: 20
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
    'repeatY': {
        name: 'Repeat Y',
        category: 'geometry',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        params: {
            reps: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 3,
                    min: 1,
                    max: 50
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
            offset: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0,
                    min: 0,
                    max: 20
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
    'kaleid': {
        name: 'Kaleid',
        category: 'geometry',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        params: {
            nSides: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 4,
                    min: 1,
                    max: 50
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
    'scroll': {
        name: 'Scroll',
        category: 'geometry',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        params: {
            scrollX: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.5,
                    min: -10,
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
            scrollY: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.5,
                    min: -10,
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
            speedX: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0,
                    min: -10,
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
            speedY: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0,
                    min: -10,
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
            }
        }
    },
    'scrollX': {
        name: 'Scroll X',
        category: 'geometry',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        params: {
            scrollX: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.5,
                    min: -10,
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
            speed: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0,
                    min: -10,
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
            }
        }
    },
    'scrollY': {
        name: 'Scroll Y',
        category: 'geometry',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        params: {
            scrollY: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.5,
                    min: -10,
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
            speed: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0,
                    min: -10,
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
            }
        }
    },
    'position': {
        name: 'Position',
        category: 'geometry',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        params: {
            positionX: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.5,
                    min: -10,
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
            positionY: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.5,
                    min: -10,
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
            }
        }
    },

    // --- Color (NO param output) ---
    'posterize': {
        name: 'Posterize',
        category: 'color',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        params: {
            bins: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 3,
                    min: 1,
                    max: 50
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
            gamma: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.6,
                    min: 0,
                    max: 5
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
    'shift': {
        name: 'Shift (RGB)',
        category: 'color',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        params: {
            r: {
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
            g: {
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
            b: {
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
            a: {
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
    'invert': {
        name: 'Invert',
        category: 'color',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
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
    'contrast': {
        name: 'Contrast',
        category: 'color',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        params: {
            amount: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.6,
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
            }
        }
    },
    'brightness': {
        name: 'Brightness',
        category: 'color',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        params: {
            amount: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.4,
                    min: -1,
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
    'luma': {
        name: 'Luma',
        category: 'color',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
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
                    default: 0.1,
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
    'thresh': {
        name: 'Threshold',
        category: 'color',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
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
    'setAlpha': {
        name: 'Set Alpha',
        category: 'color',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        params: {
            alpha: {
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
            },
        }
    },

    // --- Extra Shaders (Geometry/Coord) ---
    'invtile': {
        name: 'InvTile',
        category: 'geometry',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
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
            }
        }
    },
    'invsqrt': {
        name: 'InvSqrt',
        category: 'geometry',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        params: {
            amount: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.5,
                    min: 0,
                    max: 5
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
    'abslog': {
        name: 'AbsLog',
        category: 'geometry',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
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
            }
        }
    },
    'swave': {
        name: 'SWave',
        category: 'geometry',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
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
            }
        }
    },
    'centermag': {
        name: 'Center Mag',
        category: 'geometry',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        params: {
            r: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.4,
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
            h: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.2,
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
            cx: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.0,
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
            cy: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.0,
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
    'color': {
        name: 'Color',
        category: 'color',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        params: {
            r: {
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
            },
            g: {
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
            },
            b: {
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
            },
            a: {
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
    'saturate': {
        name: 'Saturate',
        category: 'color',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        params: {
            amount: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 2,
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
            }
        }
    },
    'hue': {
        name: 'Hue',
        category: 'color',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        params: {
            hue: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.4,
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
    'colorama': {
        name: 'Colorama',
        category: 'color',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        params: {
            amount: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.005,
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

    // --- Blend (has param input for secondary texture, NO param output) ---
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

    // --- Modulate (has param input for modulator texture, NO param output) ---
    'modulate': {
        name: 'Modulate',
        category: 'modulate',
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
                    default: 0.1,
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
    'modulateRotate': {
        name: 'Modulate Rotate',
        category: 'modulate',
        hasInput: true,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: false,
        acceptParams: ['source', 'src', 'out'],
        params: {
            multiple: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1,
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
            offset: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0,
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
    'modulateKaleid': {
        name: 'Modulate Kaleid',
        category: 'modulate',
        hasInput: true,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: false,
        acceptParams: ['source', 'src', 'out'],
        params: {
            nSides: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 4,
                    min: 1,
                    max: 50
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
    'modulateScale': {
        name: 'Modulate Scale',
        category: 'modulate',
        hasInput: true,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: false,
        acceptParams: ['source', 'src', 'out'],
        params: {
            multiple: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1,
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
            offset: {
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
    'modulatePixelate': {
        name: 'Modulate Pixelate',
        category: 'modulate',
        hasInput: true,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: false,
        acceptParams: ['source', 'src', 'out'],
        params: {
            multiple: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 10,
                    min: 1,
                    max: 100
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
            offset: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 3,
                    min: 0,
                    max: 20
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
    'modulateHue': {
        name: 'Modulate Hue',
        category: 'modulate',
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
                    max: 5
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
    'modulateRepeat': {
        name: 'Modulate Repeat',
        category: 'modulate',
        hasInput: true,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: false,
        acceptParams: ['source', 'src', 'out'],
        params: {
            repeatX: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 3,
                    min: 1,
                    max: 20
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
            repeatY: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 3,
                    min: 1,
                    max: 20
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
            offsetX: {
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
            offsetY: {
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

    // --- HydraFCS Modulate Nodes ---
    // FCS Curves
    'ipSphere': {
        name: 'ipSphere',
        category: 'modulate',
        subcategory: 'fcs',
        hasInput: true,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: false,
        acceptParams: ['source', 'src', 'out'],
        params: {
            a: {
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
            }
        }
    },
    'ipTorus': {
        name: 'ipTorus',
        category: 'modulate',
        subcategory: 'fcs',
        hasInput: true,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: false,
        acceptParams: ['source', 'src', 'out'],
        params: {
            a: {
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
            }
        }
    },
    'ipMobiusStrip': {
        name: 'ipMobius Strip',
        category: 'modulate',
        subcategory: 'fcs',
        hasInput: true,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: false,
        acceptParams: ['source', 'src', 'out'],
        params: {
            a: {
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
            }
        }
    },
    'ipCylinder': {
        name: 'ipCylinder',
        category: 'modulate',
        subcategory: 'fcs',
        hasInput: true,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: false,
        acceptParams: ['source', 'src', 'out'],
        params: {
            a: {
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
            }
        }
    },
    'ipKleinBottle': {
        name: 'ipKlein Bottle',
        category: 'modulate',
        subcategory: 'fcs',
        hasInput: true,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: false,
        acceptParams: ['source', 'src', 'out'],
        params: {
            a: {
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
            }
        }
    },
    'ipCrossCap': {
        name: 'ipCross Cap',
        category: 'modulate',
        subcategory: 'fcs',
        hasInput: true,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: false,
        acceptParams: ['source', 'src', 'out'],
        params: {
            a: {
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
            }
        }
    },
    'pAstroid': {
        name: 'pAstroid',
        category: 'modulate',
        subcategory: 'fcs',
        hasInput: true,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: false,
        acceptParams: ['source', 'src', 'out'],
        params: {
            a: {
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
            }
        }
    },
    'pSpiral': {
        name: 'pSpiral',
        category: 'modulate',
        subcategory: 'fcs',
        hasInput: true,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: false,
        acceptParams: ['source', 'src', 'out'],
        params: {}
    },
    'pCardioid': {
        name: 'pCardioid',
        category: 'modulate',
        subcategory: 'fcs',
        hasInput: true,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: false,
        acceptParams: ['source', 'src', 'out'],
        params: {
            a: {
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
            p: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 2.0,
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
            }
        }
    },
    'pConchoid': {
        name: 'pConchoid',
        category: 'modulate',
        subcategory: 'fcs',
        hasInput: true,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: false,
        acceptParams: ['source', 'src', 'out'],
        params: {
            a: {
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
            }
        }
    },
    'pEpicycloid': {
        name: 'pEpicycloid',
        category: 'modulate',
        subcategory: 'fcs',
        hasInput: true,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: false,
        acceptParams: ['source', 'src', 'out'],
        params: {
            a: {
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
            b: {
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
            }
        }
    },
    'pDescartesFolium': {
        name: 'pDescartes Folium',
        category: 'modulate',
        subcategory: 'fcs',
        hasInput: true,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: false,
        acceptParams: ['source', 'src', 'out'],
        params: {
            a: {
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
            b: {
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
            }
        }
    },
    'pHypocycloid': {
        name: 'pHypocycloid',
        category: 'modulate',
        subcategory: 'fcs',
        hasInput: true,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: false,
        acceptParams: ['source', 'src', 'out'],
        params: {
            a: {
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
            b: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 2.0,
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
            }
        }
    },
    'pHypotrochoid': {
        name: 'pHypotrochoid',
        category: 'modulate',
        subcategory: 'fcs',
        hasInput: true,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: false,
        acceptParams: ['source', 'src', 'out'],
        params: {
            a: {
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
            b: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 2.0,
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
            d: {
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
            }
        }
    },
    'pInvoluteCircle': {
        name: 'pInvolute Circle',
        category: 'modulate',
        subcategory: 'fcs',
        hasInput: true,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: false,
        acceptParams: ['source', 'src', 'out'],
        params: {
            a: {
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
            }
        }
    },
    'pCircle': {
        name: 'pCircle',
        category: 'modulate',
        subcategory: 'fcs',
        hasInput: true,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: false,
        acceptParams: ['source', 'src', 'out'],
        params: {
            a: {
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
            }
        }
    },
    'pLissajous': {
        name: 'pLissajous',
        category: 'modulate',
        subcategory: 'fcs',
        hasInput: true,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: false,
        acceptParams: ['source', 'src', 'out'],
        params: {
            a: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 5.0,
                    min: 0,
                    max: 20
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
            n: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0,
                    max: 20
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
            b: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0,
                    max: 20
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
            phase: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.0,
                    min: 0,
                    max: 3.14
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
    'pNephroid': {
        name: 'pNephroid',
        category: 'modulate',
        subcategory: 'fcs',
        hasInput: true,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: false,
        acceptParams: ['source', 'src', 'out'],
        params: {
            a: {
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
            }
        }
    },
    'pPlateau': {
        name: 'pPlateau',
        category: 'modulate',
        subcategory: 'fcs',
        hasInput: true,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: false,
        acceptParams: ['source', 'src', 'out'],
        params: {
            m: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 2.0,
                    min: 0,
                    max: 20
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
            n: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0,
                    max: 20
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
    'pTalbot': {
        name: 'pTalbot',
        category: 'modulate',
        subcategory: 'fcs',
        hasInput: true,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: false,
        acceptParams: ['source', 'src', 'out'],
        params: {
            a: {
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
            }
        }
    },
    'hpSphere': {
        name: 'hpSphere',
        category: 'modulate',
        subcategory: 'fcs',
        hasInput: true,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: false,
        acceptParams: ['source', 'src', 'out'],
        params: {
            a: {
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
            }
        }
    },
    'hpTorus': {
        name: 'hpTorus',
        category: 'modulate',
        subcategory: 'fcs',
        hasInput: true,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: false,
        acceptParams: ['source', 'src', 'out'],
        params: {
            c: {
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
            a: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.5,
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
            }
        }
    },
    'hpCone': {
        name: 'hpCone',
        category: 'modulate',
        subcategory: 'fcs',
        hasInput: true,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: false,
        acceptParams: ['source', 'src', 'out'],
        params: {
            c: {
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
            }
        }
    },
    'hpConeOblique': {
        name: 'hpCone Oblique',
        category: 'modulate',
        subcategory: 'fcs',
        hasInput: true,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: false,
        acceptParams: ['source', 'src', 'out'],
        params: {
            c: {
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
            vx: {
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
            vy: {
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
            vz: {
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
            }
        }
    },
    // --- DATA ---
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
    'out': {
        name: 'Output',
        category: 'output',
        hasInput: true,
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
            }
        }
    },
    'render': {
        name: 'Render',
        category: 'output',
        hasInput: false,
        hasOutput: false,
        hasParamInput: true,
        hasParamOutput: false,
        acceptParams: ['out'],
        params: {}
    },

    // --- Extra Shaders (Color) ---
    'sepia': {
        name: 'Sepia',
        category: 'color',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
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
    'levels': {
        name: 'Levels',
        category: 'color',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        params: {
            levels: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 3.0,
                    min: 1,
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
    'monotone': {
        name: 'Monotone',
        category: 'color',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        params: {
            levels: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 3.0,
                    min: 1,
                    max: 20
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
            hue: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.6,
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
    'grarose': {
        name: 'Gradient Rose',
        category: 'color',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
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
    'grawave': {
        name: 'Gradient Wave',
        category: 'color',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
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
    'graua': {
        name: 'Gradient Ua',
        category: 'color',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
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
    'hsvshift': {
        name: 'HSV Shift',
        category: 'color',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        params: {
            hue: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.0,
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
            saturation: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0,
                    max: 2
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
            value: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0,
                    max: 2
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
    'dither': {
        name: 'Dither (Bayer)',
        category: 'color',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        params: {}
    },
    'dither2': {
        name: 'Dither 2 (Bayer)',
        category: 'color',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        params: {}
    },
    'dither4': {
        name: 'Dither 4 (Bayer)',
        category: 'color',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        params: {}
    },
    'ditherrnd': {
        name: 'Dither (Random)',
        category: 'color',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        params: {}
    },
    'ditherrndcolor': {
        name: 'Dither (Random Color)',
        category: 'color',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        params: {}
    },
    // ASCII Art Effects
    'ascii': {
        name: 'ASCII Art',
        category: 'color',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        params: {
            cellSize: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 8.0,
                    min: 4,
                    max: 32
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
            sharpness: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0.1,
                    max: 3
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
            colorIntensity: {
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
    'asciiSimple': {
        name: 'ASCII Simple',
        category: 'color',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        params: {
            cellSize: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 10.0,
                    min: 4,
                    max: 32
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
            contrast: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.5,
                    min: 0.5,
                    max: 3
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
    'asciiMatrix': {
        name: 'ASCII Matrix',
        category: 'color',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        params: {
            cellSize: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 8.0,
                    min: 4,
                    max: 32
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
            speed: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0,
                    max: 5
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
            greenTint: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.8,
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
    'erode': {
        name: 'Erode',
        category: 'color',
        subcategory: 'source_input',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        acceptNodes: ['src'],
        params: {}
    },
    'dilate': {
        name: 'Dilate',
        category: 'color',
        subcategory: 'source_input',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        acceptNodes: ['src'],
        params: {}
    },
    'blur': {
        name: 'Blur (Kernel)',
        category: 'color',
        subcategory: 'source_input',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        acceptNodes: ['src'],
        params: {}
    },
    'blurmore': {
        name: 'Blur More',
        category: 'color',
        subcategory: 'source_input',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        acceptNodes: ['src'],
        params: {}
    },
    'edge': {
        name: 'Edge Detection',
        category: 'color',
        subcategory: 'source_input',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        acceptNodes: ['src'],
        params: {}
    },
    'sobelx': {
        name: 'Sobel X',
        category: 'color',
        subcategory: 'source_input',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        acceptNodes: ['src'],
        params: {}
    },
    'sobely': {
        name: 'Sobel Y',
        category: 'color',
        subcategory: 'source_input',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        acceptNodes: ['src'],
        params: {}
    },
    'sharpen': {
        name: 'Sharpen',
        category: 'color',
        subcategory: 'source_input',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        acceptNodes: ['src'],
        params: {}
    },
    'emboss': {
        name: 'Emboss',
        category: 'color',
        subcategory: 'source_input',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        acceptNodes: ['src'],
        params: {}
    },
    'altline': {
        name: 'Alt Line',
        category: 'color',
        subcategory: 'source_input',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        acceptNodes: ['src'],
        params: {
            width: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1.0,
                    min: 0,
                    max: 20
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
    'pxsort': {
        name: 'Pixel Sort X',
        category: 'color',
        subcategory: 'source_input',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        acceptNodes: ['src'],
        params: {
            threshold: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.2,
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
            frame: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0,
                    min: 0,
                    max: 100
                }]
            },
            dirX: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1,
                    min: -1,
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
            dirY: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0,
                    min: -1,
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
    'pysort': {
        name: 'Pixel Sort Y',
        category: 'color',
        subcategory: 'source_input',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        acceptNodes: ['src'],
        params: {
            threshold: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.2,
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
            frame: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0,
                    min: 0,
                    max: 100
                }]
            },
            dirX: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0,
                    min: -1,
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
            dirY: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 1,
                    min: -1,
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

    // --- Color Shift Effect ---
    'colorShift': {
        name: 'Color Shift',
        category: 'color',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        params: {
            amount: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.2,
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

    // --- Extra Shaders (Blend/Combine) ---
    'colcross': {
        name: 'Color Cross',
        category: 'blend',
        hasInput: true,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: false,
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
    'splitview': {
        name: 'Split View (V)',
        category: 'blend',
        hasInput: true, hasOutput: true,
        hasParamInput: true, hasParamOutput: false,
        params: {
            where: { type: 'multiple', items: [{ item: 'constant', type: 'text', default: 0.5, min: 0, max: 1 }, { item: 'nodeList', type: 'array' }, { item: 'nodeList', type: 'lfo' }, { item: 'nodeList', type: 'midi' }, { item: 'nodeList', type: 'audio_data' }], }
        }
    },
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
    'transparency': {
        name: 'Chroma Key',
        category: 'color',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        params: {
            r: {
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
            g: {
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
            b: {
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
            tol: {
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
            smooth: {
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
            }
        }
    },
}