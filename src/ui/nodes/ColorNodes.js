// ColorNodes - Auto-generated from LibraryCallbacks.js
// Category: color

export const ColorNodes = {
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
            }
        },
    },
    'glitch': {
        name: 'Glitch',
        category: 'color',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        params: {
            intensity: {
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
            },
            blockSize: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.1,
                    min: 0.01,
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
            rgbShift: {
                type: 'multiple',
                items: [{
                    item: 'constant',
                    type: 'text',
                    default: 0.02,
                    min: 0,
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

    // --- Extra Shaders (Geometry/Coord) ---
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

    // SUBCATEGORY source_input (they always follow a src node)
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
                }, {
                    item: 'nodeList',
                    type: 'array'
                }, {
                    item: 'nodeList',
                    type: 'lfo'
                }, {
                    item: 'nodeList',
                    type: 'midi_data'
                }, {
                    item: 'nodeList',
                    type: 'audio_data'
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
                }, {
                    item: 'nodeList',
                    type: 'array'
                }, {
                    item: 'nodeList',
                    type: 'lfo'
                }, {
                    item: 'nodeList',
                    type: 'midi_data'
                }, {
                    item: 'nodeList',
                    type: 'audio_data'
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

    'bitglitch': {
        name: 'Bit Glitch',
        category: 'color',
        subcategory: 'source_input',
        hasInput: true,
        hasOutput: true,
        hasParamInput: false,
        hasParamOutput: false,
        acceptNodes: ['src'],
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
            },
            timeScale: {
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
            blocky: {
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
};
