// GeometryNodes - Auto-generated from LibraryCallbacks.js
// Category: geometry

export const GeometryNodes = {
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
};
