// OutputNodes - Auto-generated from LibraryCallbacks.js
// Category: output

export const OutputNodes = {
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
};
