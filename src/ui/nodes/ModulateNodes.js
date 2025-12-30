// ModulateNodes - Auto-generated from LibraryCallbacks.js
// Category: modulate

export const ModulateNodes = {
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
};
