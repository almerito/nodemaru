// SourceNodes - Auto-generated from LibraryCallbacks.js
// Category: source

export const SourceNodes = {
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

    // --- With source input ---
    'bitGlitch': {
        name: 'Bit Glitch',
        category: 'source',
        subcategory: 'texture_input',
        hasInput: false,
        hasOutput: true,
        hasParamInput: true,
        hasParamOutput: true,
        acceptParams: ['out'],
        params: {
            /* tex: {
                type: 'sampler2D'
            }, */
            amount: {
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
            },
            timeScale: {
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
            blocky: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.1
                }, {
                    item: 'nodeList',
                    type: 'array'
                }, {
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
};
